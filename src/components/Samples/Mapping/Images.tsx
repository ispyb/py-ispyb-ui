import { useState, useEffect } from 'react';
import { useController } from 'rest-hooks';
import { Image as KonvaImage } from 'react-konva';

import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import { SampleImage } from 'models/SampleImage';

export async function awaitImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageElement = new Image();
    imageElement.onload = () => resolve(imageElement);
    imageElement.onerror = () => reject(imageElement);
    imageElement.src = src;
  });
}

function toCanvasCoordinates({ x, y }: { x: number; y: number }): {
  x: number;
  y: number;
} {
  // Coordinates in html5 canvas space are x, -y, and not x, y as you
  // might expect (!)
  return {
    x,
    y: -y,
  };
}

export default function Images({
  images,
}: // blSampleId,
{
  images: SampleImage[];
  // blSampleId: number;
}) {
  const { site } = useAuth();
  const { fetch } = useController();
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [preImages, setPreImages] = useState<Record<string, any>>({});

  // useEffect(() => {
  //   setImagesLoaded(false);
  //   setPreImages([]);
  // }, [blSampleId]);

  useEffect(() => {
    setImagesLoaded(false);
    setPreImages([]);

    async function getImages() {
      const preImages: Record<string, HTMLImageElement> = {};
      for (const image of images) {
        const imageData = await fetch(getXHRBlob, {
          src: `${site.host}${image._metadata.url}`,
        });
        // console.log('loaded image', imageData);
        preImages[`${image.blSampleImageId}`] = await awaitImage(imageData);
      }
      setPreImages(preImages);
    }
    getImages();
    console.log('images loaded');

    setImagesLoaded(true);
  }, [images, fetch, site.host]);

  return (
    <>
      {imagesLoaded && (
        <>
          {Object.entries(preImages).map(([imageId, imageElement]) => {
            const image = images.filter(
              (image) => image.blSampleImageId === parseInt(imageId)
            )[0];
            return (
              <KonvaImage
                key={image.blSampleImageId}
                image={imageElement}
                x={
                  image.offsetX -
                  (image.micronsPerPixelX * 1e3 * imageElement.width) / 2
                }
                y={
                  image.offsetY -
                  (image.micronsPerPixelY * -1e3 * imageElement.height) / 2
                }
                scaleX={image.micronsPerPixelX * 1e3}
                scaleY={image.micronsPerPixelY * -1e3}
              />
            );
          })}
        </>
      )}
    </>
  );
}
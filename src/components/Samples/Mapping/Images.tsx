import { useState, useEffect } from 'react';
import { useController } from 'rest-hooks';
import { Image as KonvaImage } from 'react-konva';

import { getXHRBlob } from 'api/resources/XHRFile';
import { useAuth } from 'hooks/useAuth';
import { SampleImage } from 'models/SampleImage';

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
      const preImages = {};
      for (const image of images) {
        const imageData = await fetch(getXHRBlob, {
          src: `${site.host}${image._metadata.url}`,
        });
        console.log('loaded image', imageData);
        // @ts-expect-error
        preImages[`${image.blSampleImageId}`] = imageData;
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
          {Object.entries(preImages).map(([imageId, blob]) => {
            const image = images.filter(
              (image) => image.blSampleImageId === parseInt(imageId)
            )[0];
            console.log('render image', image, imageId);
            const imageElement = new Image();
            imageElement.src = blob;
            return (
              <KonvaImage
                key={image.blSampleImageId}
                image={imageElement}
                x={image.offsetX}
                y={image.offsetY}
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

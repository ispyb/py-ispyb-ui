function BeamCenter() {
  return (
    <>
      <mesh>
        <meshBasicMaterial color="red" />
        <planeGeometry args={[7, 1]} />
      </mesh>
      <mesh>
        <meshBasicMaterial color="red" />
        <planeGeometry args={[1, 7]} />
      </mesh>
    </>
  );
}

export default BeamCenter;

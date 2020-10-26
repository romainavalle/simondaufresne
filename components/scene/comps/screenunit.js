// Un calcul d’une “screen unit” à une distance Z donnée, et tu convertis ton boundingClientRect par cette screenUnit
//     const x = bounding.width / $viewport.width;
//     const y = bounding.height / $viewport.height;
//     instance.scale.x = cameraUnitSize.width * x;
//     instance.scale.y = cameraUnitSize.height * y;
// ou cameraUnitSize  serait calculé de cette façon :
//   getUnitSize(depth = 0) {
//     const offset = this.position.z;
//     if (depth < offset) {
//       depth -= offset;
//     } else {
//       depth += offset;
//     }
//     const vFOV = (this.fov * Math.PI) / 180; // vertical fov in radians
//     // Math.abs to ensure the result is always positive
//     const height = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
//     const width = height * this.aspect;
//     return {
//       height,
//       width
//     };
//   }

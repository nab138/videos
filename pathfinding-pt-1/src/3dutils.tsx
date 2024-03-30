import Colors from "./colors";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { Vector2 } from "@motion-canvas/core";
import { ThreeCanvas } from "motion-canvas-3d";

export function draw3DGrid(
  c: ThreeCanvas,
  canvasWidth: number,
  canvasHeight: number,
  size: number,
  divisions: number,
  color: number,
  thickness: number
) {
  const step = size / divisions;
  const halfSize = size / 2;

  const points = [];

  for (let i = 0; i <= divisions; i++) {
    const value = i * step - halfSize;

    // Horizontal line
    points.push(new THREE.Vector3(-halfSize, value, 0));
    points.push(new THREE.Vector3(halfSize, value, 0));

    // Vertical line
    points.push(new THREE.Vector3(value, -halfSize, 0));
    points.push(new THREE.Vector3(value, halfSize, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new MeshLine();
  line.setGeometry(geometry);

  const material = new MeshLineMaterial({
    color: new THREE.Color(color),
    lineWidth: thickness, // Adjust this value to change the line thickness
    sizeAttenuation: 0,
    resolution: new THREE.Vector2(canvasWidth, canvasHeight),
    transparent: false,
  });

  const mesh = new THREE.Mesh(line, material);

  c.push(mesh);
}

export function draw3DDozer(c: ThreeCanvas) {
  const group = new THREE.Group();

  // Create the first box and add it to the group
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1, 0.4),
    new THREE.MeshStandardMaterial({ color: Colors.dozer.body })
  );
  group.add(body);

  // Create the second box and add it to the group
  const plow = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.1, 0.4),
    new THREE.MeshStandardMaterial({ color: Colors.dozer.wheels3D })
  );
  plow.position.set(0, -0.55, 0); // Adjust the position as needed
  group.add(plow);

  [
    new Vector2(-0.43, 0.3),
    new Vector2(-0.43, 0),
    new Vector2(-0.43, -0.3),
    new Vector2(0.43, 0.3),
    new Vector2(0.43, 0),
    new Vector2(0.43, -0.3),
  ].forEach((position) => {
    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
      new THREE.MeshStandardMaterial({ color: Colors.dozer.wheels3D })
    );
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(position.x, position.y, 0.2); // Adjust the position as needed
    group.add(wheel);
  });

  const [dozer3D] = c.push(group);
  return dozer3D;
}

export function addLight(
  c: ThreeCanvas,
  color: number = 0xffffff,
  intensity: number = 1
) {
  //   const light = new THREE.HemisphereLight(color, color, intensity);
  //   c.push(light);

  // use directional lights that cast shadows
  const AmbientLight = new THREE.AmbientLight(color, intensity);
  const light = new THREE.DirectionalLight(color, 0);
  light.position.set(10, 10, -15);
  light.castShadow = true;
  c.push(light);
  c.push(AmbientLight);
  return [light, AmbientLight];
}

export function draw3DPoint(
  c: ThreeCanvas,
  position: THREE.Vector3,
  color: THREE.Color,
  size: number = 0.1
) {
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(size),
    new THREE.MeshStandardMaterial({ color })
  );
  point.position.set(position.x, position.y, position.z); // Adjust the position as needed
  let [threedpoint] = c.push(point);
  return threedpoint;
}

export function drawVector(
  c: ThreeCanvas,
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: THREE.Color,
  thickness: number = 0.01,
  headLength: number = 0.1,
  headWidth: number = 0.1
) {
  // Calculate the direction from start to end
  const direction = new THREE.Vector3().copy(end).sub(start).normalize();

  // Calculate the new end point for the line that is a bit shorter
  const newEnd = new THREE.Vector3()
    .copy(direction)
    .multiplyScalar(end.distanceTo(start) - headLength)
    .add(start);

  // Create LineGeometry
  const geometry = new THREE.BufferGeometry().setFromPoints([start, newEnd]);

  // Create the line material
  const material = new MeshLineMaterial({
    color,
    lineWidth: thickness,
    sizeAttenuation: 1,
  });

  // Create the line mesh
  const line = new MeshLine();
  line.setGeometry(geometry);

  const mesh = new THREE.Mesh(line.geometry, material);

  let [m] = c.push(mesh);

  // Create an arrowhead
  const arrow = new THREE.ArrowHelper(
    direction,
    start,
    end.distanceTo(start),
    color,
    headLength,
    headWidth
  );
  let [a] = c.push(arrow);
  return [mesh, arrow];
}

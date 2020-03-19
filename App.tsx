import React from 'react';
import { AR } from 'expo';
import { GraphicsView } from 'expo-graphics';
import { Renderer, THREE } from 'expo-three';
import { BackgroundTexture, Camera } from 'expo-three-ar';
import { View, Platform } from 'react-native';

let renderer, scene: THREE.Scene, camera: Camera;

export default function App() {
  // iOS以外では実行しない
  if (Platform.OS !== 'ios') return null;

  // コンテキストの作成
  const onContextCreate = async ({ gl, pixelRatio, width, height }) => {
    // ARの平面をみつける
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

    // await addDetectionImageAsync(image);

    renderer = new Renderer({ gl, pixelRatio, width, height });
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;
    // renderer.shadowMap.enabled = true;

    // シーンの作成
    scene = new THREE.Scene();
    scene.background = new BackgroundTexture(renderer) as unknown as THREE.Texture;

    // カメラの作成
    camera = new Camera(width, height, 0.01, 2000);

    // 立方体の作成
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    // マテリアル
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000
    });

    const cube = new THREE.Mesh(geometry, material);

    cube.position.z = -0.4;
    scene.add(cube);
    
    // ライト
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

  }

  // リサイズ
  const onResize = ({ scale, width, height }) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(scale);
    renderer.setSize(width, height);
  }

  // レンダー
  const onRender = delta => {
    // if (mesh) {
    //   mesh.update(delta);
    // }
    renderer.render(scene, camera);
  }

  return (
    <View style={{ flex: 1 }}>
      <GraphicsView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
        onResize={onResize}
        onRender={onRender}
        isArEnabled
        isArRunningStateEnabled
        isArCameraStateEnabled
      />
    </View>
  );
}

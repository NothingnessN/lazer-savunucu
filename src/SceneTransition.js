export function transitionTo(scene, targetScene, data = {}) {
  if (scene.cameras.main._fadeOutActive) return;
  scene.cameras.main.fadeOut(280, 0, 0, 0);
  scene.time.delayedCall(280, () => {
    scene.scene.start(targetScene, data);
  });
}

export function fadeInScene(scene, duration = 380) {
  scene.cameras.main.fadeFrom(0, duration, 0, 0, 0);
}

import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import { 
  Stage,
  Container,
  AnimatedSprite,
  useTick } from '@pixi/react';


const [width, height] = [500, 500]; // Размер холста
const spritesheetURL_json = "/01.json";


export default function Sprite() {
  return (
    <Stage width={width} height={height} options={{ autoDensity: true }}>
      <Island />
    </Stage>
  )
}

const Island = () => {
  const [frames, setFrames] = useState([]); // Для хранения ключевых кадров
  const [yOffset, setYOffset] = useState({ isUp: true, val: 0 }); // Для хранения смещения по оси Y

  
  useTick(delta => setYOffset(prev => {
   /**
   * Тикер срабатывает с частотой около 60fps, но это число не точное.
   * Поэтму передает параметр delta для сглаживания анимации - дельта времени между тиками.
   * В данном тикере анимируется эффект "левитации" - смещение по вертикали. 
   */
    const stepSize = (delta * 1.2);
    const newVal = prev.isUp ? prev.val + stepSize : prev.val - stepSize

    return {
      isUp: Math.abs(newVal) < 50 ? prev.isUp : !prev.isUp,
      val: newVal
    }
  }));

  useEffect(() => {
    assetsLoader();
  }, [])

  const assetsLoader = async () => {
    /**
     * Загрузка текстур в версии 7+ делается с помощью PIXI.Assets.load
     */
    const resource = await PIXI.Assets.load(spritesheetURL_json);
    setFrames(
      Object.keys(resource.data.frames)
      .map(frame =>
        PIXI.Texture.from(frame)
      )
    );
  }

  if (frames.length === 0) {
    return null;
  }

  return (
    <Container x={width / 2} y={height / 2 + yOffset.val}>
      <AnimatedSprite
        animationSpeed={0.12} // Параметр позволяет уменьшить fps для спрайта. в данном случае +/- 7.2fps
        isPlaying={true}
        textures={frames}
        anchor={0.5} // Положение относительно контейнера - в данном случае в центре
      />
    </Container>
  );
};
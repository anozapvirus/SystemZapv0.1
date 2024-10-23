import React, { useEffect } from 'react';
import './FlowerAnimation.css'; // Arquivo CSS para animação
import rosa from '../rosa.png'; // Ajuste para o caminho correto

const FlowerAnimation = () => {
  useEffect(() => {
    const generateFlowers = () => {
      const flowerCount = 10; // Número de flores
      const container = document.querySelector('body'); // Adiciona ao corpo do documento

      for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div'); // Cria o div da flor
        flower.classList.add('flower'); // Adiciona a classe 'flower'
        flower.style.backgroundImage = `url(${rosa})`; // Definindo a imagem
        flower.style.left = `${Math.random() * 100}%`; // Distribui aleatoriamente na tela
        flower.style.animationDuration = `${Math.random() * 5 + 8}s`; // Define duração aleatória
        container.appendChild(flower); // Adiciona a flor no container
      }
    };

    generateFlowers(); // Gera as flores

    return () => {
      document.querySelectorAll('.flower').forEach(flower => flower.remove()); // Limpa as flores ao desmontar
    };
  }, []);

  return null; // Não retorna JSX
};

export default FlowerAnimation;

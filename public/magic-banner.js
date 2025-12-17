(function () {
  'use strict';

  // Configuração
  const API_BASE_URL = window.location.origin;
  const currentUrl = window.location.href;

  /**
   * Valida se o horário atual está dentro do intervalo configurado
   * @param {string} startTime - Horário de início (HH:MM)
   * @param {string} endTime - Horário de fim (HH:MM)
   * @returns {boolean}
   */
  function isWithinTimeRange(startTime, endTime) {
    if (!startTime || !endTime) {
      return true; // Sem restrição de horário
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Verificar se o horário atual está dentro do intervalo
    if (startMinutes <= endMinutes) {
      // Caso normal: start < end (ex: 08:00 - 18:00)
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Caso que cruza meia-noite (ex: 22:00 - 02:00)
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  /**
   * Cria e insere o banner na página
   * @param {Object} bannerData - Dados do banner
   */
  function displayBanner(bannerData) {
    // Criar container do banner
    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'magic-banner-container';
    bannerContainer.style.cssText = `
      position: relative;
      width: 100%;
      max-height: 100vh;
      z-index: 9999;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    `;

    // Criar imagem do banner
    const bannerImage = document.createElement('img');
    bannerImage.src = bannerData.image_url;
    bannerImage.alt = 'Banner';
    bannerImage.style.cssText = `
      width: 100%;
      max-height: 100vh;
      height: auto;
      display: block;
      margin: 0;
      padding: 0;
      object-fit: contain;
    `;

    // Criar botão de fechar (X)
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Fechar banner');
    closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.background = 'rgba(0, 0, 0, 0.8)';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.background = 'rgba(0, 0, 0, 0.6)';
    });

    closeButton.addEventListener('click', () => {
      bannerContainer.style.opacity = '0';
      bannerContainer.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        bannerContainer.remove();
        console.log('[Magic Banner] Banner fechado pelo usuário');
      }, 600);
    });

    // Adicionar elementos ao container
    bannerContainer.appendChild(bannerImage);
    bannerContainer.appendChild(closeButton);

    // Inserir no topo do body
    if (document.body.firstChild) {
      document.body.insertBefore(bannerContainer, document.body.firstChild);
    } else {
      document.body.appendChild(bannerContainer);
    }

    // Animar entrada após um pequeno delay
    setTimeout(() => {
      bannerContainer.style.opacity = '1';
      bannerContainer.style.transform = 'translateY(0)';
    }, 100);

    // Log de sucesso
    console.log('[Magic Banner] Banner exibido com sucesso:', bannerData.url);
  }

  /**
   * Busca e exibe o banner para a URL atual
   */
  async function loadBanner() {
    try {
      const apiUrl = `${API_BASE_URL}/api/banners?url=${encodeURIComponent(
        currentUrl
      )}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.warn('[Magic Banner] Erro na resposta da API:', response.status);
        return;
      }

      const bannerData = await response.json();

      if (!bannerData) {
        console.log('[Magic Banner] Nenhum banner encontrado para esta URL');
        return;
      }

      // Validar horário de exibição
      if (
        bannerData.start_time &&
        bannerData.end_time &&
        !isWithinTimeRange(bannerData.start_time, bannerData.end_time)
      ) {
        console.log(
          '[Magic Banner] Banner não exibido: fora do horário configurado',
          {
            start: bannerData.start_time,
            end: bannerData.end_time,
          }
        );
        return;
      }

      // Exibir banner
      displayBanner(bannerData);
    } catch (error) {
      console.error('[Magic Banner] Erro ao carregar banner:', error);
    }
  }

  // Executar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBanner);
  } else {
    loadBanner();
  }
})();


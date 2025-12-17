(function () {
  'use strict';

  const API_BASE_URL = window.location.origin;
  const currentUrl = window.location.href;

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

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  function displayBanner(bannerData) {
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

    bannerContainer.appendChild(bannerImage);

    if (document.body.firstChild) {
      document.body.insertBefore(bannerContainer, document.body.firstChild);
    } else {
      document.body.appendChild(bannerContainer);
    }

    setTimeout(() => {
      bannerContainer.style.opacity = '1';
      bannerContainer.style.transform = 'translateY(0)';
    }, 100);

    console.log('[Magic Banner] Banner exibido com sucesso:', bannerData.url);
  }

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

      displayBanner(bannerData);
    } catch (error) {
      console.error('[Magic Banner] Erro ao carregar banner:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBanner);
  } else {
    loadBanner();
  }
})();


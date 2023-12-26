import { el } from "redom";
import ymaps from "ymaps";
import "./map.scss";

export function createMap() {
  const mapContainer = el("div.map", el("h1.map-title", "Карта банкоматов"));

  ymaps
    .load(
      "https://api-maps.yandex.ru/2.1/?apikey=d4d80d4c-a984-40e8-8289-4c21ddb212ba&lang=ru_RU"
    )
    .then((maps) => {
      const map = new maps.Map(mapContainer, {
        center: [55.7558, 37.6176],
        zoom: 12,
      });

      fetch("http://localhost:3000/banks")
        .then((response) => response.json())
        .then((data) => {
          const atmData = data.payload;

          atmData.forEach((atm) => {
            const placemark = new maps.Placemark([atm.lat, atm.lon], {
              hintContent: "Coin.",
            });
            map.geoObjects.add(placemark);
          });
        })
        .catch((error) =>
          console.error("Ошибка при получении данных о банкоматах:", error)
        );
    })
    .catch((error) =>
      console.error("Ошибка при загрузке Yandex Maps API:", error)
    );

  return mapContainer;
}

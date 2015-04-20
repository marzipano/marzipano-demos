var APP_DATA = {
  "scenes": [
    {
      "id": "gare_do_oriente",
      "name": "Oriente Station",
      "levels": [
        { "tileSize": 256, "size": 256, "fallbackOnly": true },
        { "size": 512, "tileSize": 512 },
        { "size": 1024, "tileSize": 512 },
        { "size": 2048, "tileSize": 512 }
      ],
      "hotspots": [
        {
          "yaw": 0,
          "pitch": 0,
          "target": "jeronimos"
        }
      ],
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 1.5707963267948966
      }
    },
    {
      "id": "jeronimos",
      "name": "Jerónimos Monastery",
      "levels": [
        { "tileSize": 256, "size": 256, "fallbackOnly": true },
        { "size": 512, "tileSize": 512 },
        { "size": 1024, "tileSize": 512 },
        { "size": 2048, "tileSize": 512 }
      ],
      "hotspots": [
        {
          "yaw": 0.5,
          "pitch": 0.2,
          "target": "museu_da_electricidade"
        }
      ],
      "initialViewParameters": {
        "pitch": 0,
        "yaw": 0,
        "fov": 0.9
      }
    },
    {
      "id": "museu_da_electricidade",
      "name": "Eletricity Museum",
      "levels": [
        { "tileSize": 256, "size": 256, "fallbackOnly": true },
        { "size": 512, "tileSize": 512 },
        { "size": 1024, "tileSize": 512 },
        { "size": 2048, "tileSize": 512 }
      ],
      "hotspots": [
        {
          "yaw": 1.6,
          "pitch": 0,
          "target": "jeronimos"
        }
      ],
      "initialViewParameters": {
        "pitch": -0.6,
        "yaw": 0.9,
        "fov": 1.0
      }
    }
  ],
  "name": "Marzipano Demo",
  "settings": {
    "mouseViewMode": "drag",
    "autorotateEnabled": "true"
  }
};

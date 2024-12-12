const s = (sketch) => {
  let images = [];
  let currentImageIndex = 0;
  let mosaicTiles = [];
  let flowers = [];
  let dotRadius = 2;
  let lastImageChange = 0;
  let changeInterval = 10000;
  let colorPicker;

  sketch.preload = () => {
    for (let i = 1; i <= 5; i++) {
      images.push(sketch.loadImage(`Flower_Mosaic/images/garden${i}.jpg`));
      // images.push(sketch.loadImage("Flower_Mosaic/images/garden1.jpg"));
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    // Create color picker
    colorPicker = sketch.createColorPicker("#ff0000");
    colorPicker.position(10, sketch.height - 70);
    colorPicker.style("width", "100px");

    let plantButton = sketch.createButton("Plant a Flower");
    plantButton.position(130, sketch.height - 70);
    plantButton.mousePressed(plantFlower);
    drawMosaic(dotRadius);
    sketch.loop();
  };

  sketch.draw = () => {
    let currentTime = sketch.millis();

    if (currentTime - lastImageChange > changeInterval) {
      lastImageChange = currentTime;
      currentImageIndex = (currentImageIndex + 1) % images.length;
      drawMosaic(dotRadius);
      drawFlowers();
    }
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    drawMosaic(dotRadius);
    drawFlowers();
  };

  const drawMosaic = (dotRadius) => {
    sketch.background(30, 30, 30);
    let img = images[currentImageIndex];
    img.resize(sketch.width, sketch.height);

    mosaicTiles = []; // Clear and recalculate mosaic tiles

    for (let x = 0; x < sketch.width; x += dotRadius * 3) {
      for (let y = 0; y < sketch.height; y += dotRadius * 3) {
        let tileColor = img.get(x, y);
        mosaicTiles.push({ x: x, y: y, color: tileColor });

        sketch.noStroke();
        sketch.fill(tileColor);
        sketch.ellipse(x, y, dotRadius * 2);
      }
    }
  };

  const plantFlower = () => {
    let randomTile = sketch.random(mosaicTiles); // Pick a random mosaic tile

    flowers.push({
      x: randomTile.x,
      y: randomTile.y,
      color: colorPicker.color(),
    });

    drawFlowers();
  };

  const drawFlowers = () => {
    for (let flower of flowers) {
      sketch.fill(flower.color);
      sketch.noStroke();
      sketch.ellipse(flower.x, flower.y, dotRadius * 2);
    }
  };
};

new p5(s); // Initialize the sketch

$(function () {
  const gridLength = 100;
  const mapArray = [
    [0, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [3, 1, 2, 1, 2, 1, 2, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0],
  ];

  const canvas = $("#myCanvas")[0];
  const ctx = canvas.getContext("2d");
  const currentImgMain = { x: 0, y: 0 };

  const sources = {
    imgMountain: "images/material.png",
    imgEnemy: "images/Enemy.png",
    imgMain: "images/spriteSheet.png",
  };

  function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = Object.keys(sources).length;

    for (var src in sources) {
      images[src] = new Image();
      images[src].onload = function () {
        if (++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  }
}

  loadImages(sources, (images) => {
    imgMain.onload = () => {
      ctx.drawImage(
        images.imgMain,
        currentImgMain.x,
        currentImgMain.y,
        80,
        130
      );
    };

    // Draw grid images
    mapArray.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const xPos = colIndex * gridLength;
        const yPos = rowIndex * gridLength;

        if (cell === 1) {
          ctx.drawImage(images.imgMountain, xPos, yPos, gridLength, gridLength);
        } else if (cell === 3) {
          ctx.drawImage(images.imgEnemy, xPos, yPos, gridLength, gridLength);
        }
      });
    });
  });

  // Key event handling
  $(document).on("keydown", function (event) {
    console.log(event.code);
    let targetImg, targetBlock, cutImagePositionX;
    targetImg = {
      x: -1,
      y: -1,
    };
    targetBlock = {
      x: -1,
      y: -1,
    };
    event.preventDefault();
    switch (event.code) {
      case "ArrowLeft":
        targetImg.x = currentImgMain.x - gridLength;
        targetImg.y = currentImgMain.y;
        cutImagePositionX = 175;
        break;
      case "ArrowUp":
        targetImg.x = currentImgMain.x;
        targetImg.y = currentImgMain.y - gridLength;
        cutImagePositionX = 355;
        break;
      case "ArrowRight":
        targetImg.x = currentImgMain.x + gridLength;
        targetImg.y = currentImgMain.y;
        cutImagePositionX = 540;
        break;
      case "ArrowDown":
        targetImg.x = currentImgMain.x;
        targetImg.y = currentImgMain.y + gridLength;
        cutImagePositionX = 0;
        break;
      default:
        return;
    }

    if (
      targetImg.x >= 0 &&
      targetImg.x <= 700 &&
      targetImg.y >= 0 &&
      targetImg.y <= 500
    ) {
      targetBlock.x = targetImg.y / gridLength;
      targetBlock.y = targetImg.x / gridLength;
    } else {
      targetBlock.x = -1;
      targetBlock.y = -1;
    }

    ctx.clearRect(currentImgMain.x, currentImgMain.y, gridLength, gridLength);

    if (targetBlock.x !== -1 && targetBlock.y !== -1) {
      switch (mapArray[targetBlock.x][targetBlock.y]) {
        case 0:
          $("#talkBox").text("");
          currentImgMain.x = targetImg.x;
          currentImgMain.y = targetImg.y;
          break;
        case 1:
          $("#talkBox").text("有山");
          break;
        case 2: // Final Stop
          $("#talkBox").text("抵達終點");
          currentImgMain.x = targetImg.x;
          currentImgMain.y = targetImg.y;
          break;
        case 3: //Enemy
          $("#talkBox").text("哈摟");
          break;
      }
    } else {
      $("#talkBox").text("邊界");
    }

    ctx.drawImage(
      images.imgMain,
      cutImagePositionX,
      0,
      80,
      130,
      currentImgMain.x,
      currentImgMain.y,
      gridLength,
      gridLength
    );
  });
;

import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  
  // Print the start and end pixels of the line
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);

  // If the pixels are just seperated by 1 then there is no need to do anything because the line is connected
  // so only run this if yhe pixels from either direction are seperated by more than 1 pixel
  if (Math.abs(x2-x1) > 1 || Math.abs(y2-y1) > 1) {
    // Find the difference between both the x and y values from the 2 pixels
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dx_abs = Math.abs(dx);
    let dy_abs = Math.abs(dy);

    let x = x1;
    let y = y1;

    // if dx is greater than dy than the slope is less than absolute value of 1
    if (dx_abs > dy_abs) {
      // find the slope of each colour so we can change pixel by pixel
      let rs = (r2-r1)/dx_abs;
      let gs = (g2-g1)/dx_abs;
      let bs = (b2-b1)/dx_abs;
      let r = 0.0;
      let g = 0.0;
      let b = 0.0;

      // run a for loop that spans the number of times form x2 to x1
      let D = 2*dy_abs - dx_abs;
      for (let i = 0; i < dx_abs; i++) {
        // compare dx to see if x is to increase of decrease and change the colour values
        x = dx < 0 ? x-1 : x+1;
        r += rs;
        g += gs;
        b += bs;

        // if D is greater than 0, then update it
        if (D < 0) {
          D += 2*dy_abs;
        }
        else {
          // else update y and set D
          y = dy < 0 ? y-1 : y+1;
          D += 2*(dy_abs - dx_abs);
        }
        // set the pixel
        this.setPixel(x, y, [r1+r, g1+g, b1+b]);
      }
    }
    else {
      // if the slope is steep
      // do the same thing except run the for loop with dy because slope is greater than abs value of 1
      let rs = (r2-r1)/dy_abs;
      let gs = (g2-g1)/dy_abs;
      let bs = (b2-b1)/dy_abs;
      let r = 0.0;
      let g = 0.0;
      let b = 0.0;

      let D = 2*dx_abs - dy_abs;
      for (let i = 0; i < dy_abs; i++) {
        r += rs;
        g += gs;
        b += bs;

        y = dy < 0 ? y-1 : y+1;
        if (D < 0) {
          D += 2*dx_abs;
        }
        else {
          x = dx < 0 ? x-1 : x+1;
          D += 2*(dx_abs - dy_abs);
        }
        this.setPixel(x, y, [r1+r, g1+g, b1+b]);
      }
    }
  }
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle

  // find the area from the 3 points by running the helper function and store it in variable
  let area = inside(x1, y1, x2, y2, x3, y3);

  // run a nested for loop to go through all the pixels (100 will go through more than enough pixels)
  for (let j = 0; j < 100; ++j) {
    for (let i = 0; i < 100; ++i) {
      // store the pixels inside variables
      let p1 = i;
      let p2 = j;
      // find the area of the pixel with our original 3 points
      let w0 = inside(x2, y2, x3, y3, p1, p2);
      let w1 = inside(x3, y3, x1, y1, p1, p2);
      let w2 = inside(x1, y1, x2, y2, p1, p2);

      // if the point is greater or equal to 0 for all 3 combinations then we know it is inside the lines
      // did this part here, instead of a boolean function (same outcome)
      if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
        // update the 3 variables found with the helper, by dividing by the area
        w0 /= area;
        w1 /= area;
        w2 /= area;
        // update the 3 colours
        let r = w0 * r1 + w1 * r2 + w2 * r3;
        let g = w0 * g1 + w1 * g2 + w2 * g3;
        let b = w0 * b1 + w1 * b2 + w2 * b3;
        
        // set the pixel
        this.setPixel(i, j, [r, g, b]);
      }
    }
  }
}

// helper function that caluclates the area for the three points given
function inside(x1, y1, x2, y2, px, py) {
  return (px-x1)*(y2-y1)-(py-y1)*(x2-x1);
}

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,10,10,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,10,0.0,0.0,1.0;",
  "v,10,52,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,1;",
  "v,10,10,1.0,1.0,1.0;",
  "v,10,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,10,0.0,0.0,0.0;",
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;"
].join("\n");


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };

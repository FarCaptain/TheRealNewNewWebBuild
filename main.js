/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canv");
const gl = canvas.getContext("webgl2");

var vsource = `#version 300 es
layout (location = 0) in vec3 aPos;
uniform highp mat4 proj;
uniform highp mat4 view;
uniform highp mat4 model;
void main() {
  gl_Position = proj * view * model * vec4(aPos, 1.0);
}
`;

var fsource = `#version 300 es
out highp vec4 FragColor;
void main() {
  FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

var app = {
  shader: createShader(),
  VAO: createVAO(),
  projectionMatrix: createPerspective(),
  rotationAngle: 0,
};

function main() {
  render();
}

function render() {
  // fill canvas blue
  gl.clearColor(0.0, 0.7, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  app.rotationAngle+=0.01;

  // draw shape
  gl.useProgram(app.shader);

  gl.uniformMatrix4fv(gl.getUniformLocation(app.shader, "proj"), false, app.projectionMatrix);
  gl.uniformMatrix4fv(gl.getUniformLocation(app.shader, "view"), false, createTranslation(0, 0, -3));
  gl.uniformMatrix4fv(gl.getUniformLocation(app.shader, "model"), false, createRotation());

  gl.bindVertexArray(app.VAO);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // recall this function to make loop
  requestAnimationFrame(render);
}

function createShader() {
  var vs = gl.createShader(gl.VERTEX_SHADER);
  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vs, vsource);
  gl.shaderSource(fs, fsource);
  gl.compileShader(vs);
  gl.compileShader(fs);
  var shader = gl.createProgram();
  gl.attachShader(shader, vs);
  gl.attachShader(shader, fs);
  gl.linkProgram(shader);
  return shader;
}

function createVAO() {
  var vertices = [
    -0.5, -0.5, 0.0, 
     0.5, -0.5, 0.0, 
     0.0,  0.5, 0.0
  ];

  var VAO = gl.createVertexArray();
  var VBO = gl.createBuffer();
  gl.bindVertexArray(VAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(0);

  return VAO;
}

function createPerspective() {
  var f = 100;
  var n = 0.1;
  var fov = 45;
  var s = 1/(Math.tan((fov/2)*(Math.PI/180)));
  var matrix = [
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, -f/(f-n), -1,
    0, 0, -(f*n)/(f-n), 1,
  ];

  return matrix;
}

function createRotation() {
  var a = app.rotationAngle;
  var matrix = [
    Math.cos(a), 0, Math.sin(a),  0,
    0,           1, 0,            0,
    -Math.sin(a), 0, Math.cos(a), 0,
    0,            0,0,           1,
  ];

  return matrix;
}

function createTranslation(x, y, z) {
  var matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ]
  return matrix;
}

window.onload = main;

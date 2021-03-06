"use strict"

function vector3MutiplyMatrix3(v, m) {
    var r = {}
    r.x = v.x * m[3 * 0 + 0] + v.y * m[3 * 1 + 0] + v.z * m[3 * 2 + 0]
    r.y = v.x * m[3 * 0 + 1] + v.y * m[3 * 1 + 1] + v.z * m[3 * 2 + 1]
    r.z = v.x * m[3 * 0 + 2] + v.y * m[3 * 1 + 2] + v.z * m[3 * 2 + 2]
    return r
}

function vector3MutiplyMatrix4(v, m) {
    var r = {}
    r.x = v.x * m[4 * 0 + 0] + v.y * m[4 * 1 + 0] + v.z * m[4 * 2 + 0]
    r.y = v.x * m[4 * 0 + 1] + v.y * m[4 * 1 + 1] + v.z * m[4 * 2 + 1]
    r.z = v.x * m[4 * 0 + 2] + v.y * m[4 * 1 + 2] + v.z * m[4 * 2 + 2]
    return r
}

function matrix4MutiplyMatrix4(m1, m2) {
    var m = new Array()
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            m[i * 4 + j] = 0
            for (var k = 0; k < 4; k++) {
                m[i * 4 + j] += m1[i * 4 + k] * m2[k * 4 + j]
            }
        }
    }
    return m
}

function matrix3MutiplyMatrix3(m1, m2) {
    var m = new Array()
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            m[i * 3 + j] = 0
            for (var k = 0; k < 3; k++) {
                m[i * 3 + j] += m1[i * 3 + k] * m2[k * 3 + j]
            }
        }
    }
    return m
}

var UP = { x: 0, y: 1, z: 0 }
var DIRECTION = { x: 0, y: 0, z: -1 }
var RIGHT = { x: 1, y: 0, z: 0 }

function crossProduct(a, b) {
    var c = {}
    c.x = a.y * b.z - a.z * b.y
    c.y = a.z * b.x - a.x * b.z
    c.z = a.x * b.y - a.y * b.x
    return c
}

function kOf(k, v) {
    return {
        x: k * v.x,
        y: k * v.y,
        z: k * v.z
    }
}

function translateCamera(camera, direction) {
    var tm = new THREE.Matrix4()
    tm.elements = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        direction.x * FOOT, direction.y * FOOT, direction.z * FOOT, 1
    ]
    camera.applyMatrix(tm)
}

function WKeyDown(camera) {
    var direction = vector3MutiplyMatrix4(DIRECTION, camera.matrix.elements)
    translateCamera(camera, direction)
}

function SKeyDown(camera) {
    var direction = vector3MutiplyMatrix4(DIRECTION, camera.matrix.elements)
    translateCamera(camera, kOf(-1, direction))
}

function AKeyDown(camera) {
    var right = vector3MutiplyMatrix4(RIGHT, camera.matrix.elements)
    translateCamera(camera, kOf(-1, right))
}

function DKeyDown(camera) {
    var right = vector3MutiplyMatrix4(RIGHT, camera.matrix.elements)
    translateCamera(camera, right)
}

function QKeyDown(camera) {
    var up = vector3MutiplyMatrix4(UP, camera.matrix.elements)
    translateCamera(camera, up)
}

function EKeyDown(camera) {
    var up = vector3MutiplyMatrix4(UP, camera.matrix.elements)
    translateCamera(camera, kOf(-1, up))
}

function rotateX(radians) {
    var cos = Math.cos(radians)
    var sin = Math.sin(radians)
    var m = [
        1, 0, 0,
        0, cos, sin,
        0, -1 * sin, cos
    ]
    return m
}

function rotateY(radians) {
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var m = [
        cos, 0, -1 * sin,
        0, 1, 0,
        sin, 0, cos
    ]
    return m
}

function rotateZ(radians) {
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var m = [
        cos, sin, 0, -1 * sin, cos, 0,
        0, 0, 1
    ]
    return m
}

function abs(a) {
    if (a < 0) {
        a *= -1
    }
    return a
}

function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z
}

function lengthOf(v) {
    return Math.sqrt(dotProduct(v, v))
}

function unitization(v) {
    var u = {}
    var len = lengthOf(v)
    u.x = v.x / len
    u.y = v.y / len
    u.z = v.z / len
    return u
}

var X = { x: 1, y: 0, z: 0 }
var Y = { x: 0, y: 1, z: 0 }
var Z = { x: 0, y: 0, z: 1 }

function rotate(axis, rad) {
    var r
    var dotAxisX = dotProduct(axis, X)
    var radAxisX = Math.acos(dotAxisX)
    var dotAxisY = dotProduct(axis, Y)
    var radAxisY = Math.acos(dotAxisY)
    if (abs(dotAxisX) < abs(dotAxisY)) {
        var b = unitization(crossProduct(axis, X))
        var dotBY = dotProduct(b, Y)
        var radBY = Math.acos(dotBY)
        var dotBZ = dotProduct(b, Z)
        var radBZ = Math.acos(dotBZ)
        if (abs(dotBY) < abs(dotBZ)) {
            if (b.z > 0) {
                radBY *= -1
            }
            r = rotateX(radBY)
            axis = vector3MutiplyMatrix3(axis, r)
            if (axis.z < 0) {
                radAxisX *= -1
            }
            r = matrix3MutiplyMatrix3(r, rotateY(radAxisX))
            r = matrix3MutiplyMatrix3(r, rotateX(rad))
            r = matrix3MutiplyMatrix3(r, rotateY(-1 * radAxisX))
            r = matrix3MutiplyMatrix3(r, rotateX(-1 * radBY))
        } else {
            if (b.y < 0) {
                radBZ *= -1
            }
            r = rotateX(radBZ)
            axis = vector3MutiplyMatrix3(axis, r)
            if (axis.y > 0) {
                radAxisX *= -1
            }
            r = matrix3MutiplyMatrix3(r, rotateZ(radAxisX))
            r = matrix3MutiplyMatrix3(r, rotateX(rad))
            r = matrix3MutiplyMatrix3(r, rotateZ(-1 * radAxisX))
            r = matrix3MutiplyMatrix3(r, rotateX(-1 * radBZ))
        }
    } else {
        var b = unitization(crossProduct(axis, Y))
        var dotBX = dotProduct(b, X)
        var radBX = Math.acos(dotBX)
        var dotBZ = dotProduct(b, Z)
        var radBZ = Math.acos(dotBZ)
        if (abs(dotBX) < abs(dotBZ)) {
            if (b.z < 0) {
                radBX *= -1
            }
            r = rotateY(radBX)
            axis = vector3MutiplyMatrix3(axis, r)
            if (axis.z > 0) {
                radAxisY *= -1
            }
            r = matrix3MutiplyMatrix3(r, rotateX(radAxisY))
            r = matrix3MutiplyMatrix3(r, rotateY(rad))
            r = matrix3MutiplyMatrix3(r, rotateX(-1 * radAxisY))
            r = matrix3MutiplyMatrix3(r, rotateY(-1 * radBX))
        } else {
            if (b.x > 0) {
                radBZ *= -1
            }
            r = rotateY(radBZ)
            axis = vector3MutiplyMatrix3(axis, r)
            if (axis.x < 0) {
                radAxisY *= -1
            }
            r = matrix3MutiplyMatrix3(r, rotateZ(radAxisY))
            r = matrix3MutiplyMatrix3(r, rotateY(rad))
            r = matrix3MutiplyMatrix3(r, rotateZ(-1 * radAxisY))
            r = matrix3MutiplyMatrix3(r, rotateY(-1 * radBZ))
        }
    }
    return r
}

function rotateCamera(camera, rotateMatrix) {
    var m = [
        camera.matrix.elements[0], camera.matrix.elements[1], camera.matrix.elements[2],
        camera.matrix.elements[4], camera.matrix.elements[5], camera.matrix.elements[6],
        camera.matrix.elements[8], camera.matrix.elements[9], camera.matrix.elements[10]
    ]
    m = matrix3MutiplyMatrix3(m, rotateMatrix)
    camera.matrix.elements = [
        m[0], m[1], m[2], camera.matrix.elements[3],
        m[3], m[4], m[5], camera.matrix.elements[7],
        m[6], m[7], m[8], camera.matrix.elements[11],
        camera.matrix.elements[12], camera.matrix.elements[13], camera.matrix.elements[14], camera.matrix.elements[15]
    ]
    camera.matrix.decompose(camera.position, camera.quaternion, camera.scale)
}

function IKeyDown(camera) {
    var right = vector3MutiplyMatrix4(RIGHT, camera.matrix.elements)
    var rm = rotate(right, TOOTH)
    rotateCamera(camera, rm)
}

function KKeyDown(camera) {
    var right = vector3MutiplyMatrix4(RIGHT, camera.matrix.elements)
    var rm = rotate(right, -1 * TOOTH)
    rotateCamera(camera, rm)
}

function JKeyDown(camera) {
    var up = vector3MutiplyMatrix4(UP, camera.matrix.elements)
    var rm = rotate(up, TOOTH)
    rotateCamera(camera, rm)
}

function LKeyDown(camera) {
    var up = vector3MutiplyMatrix4(UP, camera.matrix.elements)
    var rm = rotate(up, -1 * TOOTH)
    rotateCamera(camera, rm)
}

function UKeyDown(camera) {
    var direction = vector3MutiplyMatrix4(DIRECTION, camera.matrix.elements)
    var rm = rotate(direction, TOOTH)
    rotateCamera(camera, rm)
}

function OKeyDown(camera) {
    var direction = vector3MutiplyMatrix4(DIRECTION, camera.matrix.elements)
    var rm = rotate(direction, -1 * TOOTH)
    rotateCamera(camera, rm)
}
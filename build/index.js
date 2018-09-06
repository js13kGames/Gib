!function(){"use strict";var t="uniform mat4 projection;uniform mat4 view;attribute vec3 vertex0Position;attribute vec2 vertex1TexCoord;attribute float vertex2Tint;varying vec2 texCoord;varying float tint;void main(){gl_PointSize=64.0;gl_Position=projection*view*vec4(vertex0Position,1.0);texCoord=vertex1TexCoord;tint=vertex2Tint;}",e="precision highp float;uniform sampler2D tex;varying vec2 texCoord;varying float tint;void main(){vec2 texCoord=mix((vec2(16.0)*texCoord)/vec2(128.0,64.0),(vec2(16.0)*(texCoord+vec2(1.0)))/vec2(128.0,64.0),gl_PointCoord);vec4 texel=texture2D(tex,texCoord);gl_FragColor=vec4(texel.rgb+vec3(tint),texel.a);if(gl_FragColor.a<0.1){discard;}}",i="uniform mat4 projection;uniform mat4 view;uniform float time;attribute vec2 vertex0Position;attribute vec3 vertex1Color;attribute vec2 vertex2Velocity;attribute float vertex3Emitted;attribute float vertex4Lifetime;varying vec4 color;void main(){float age=time-vertex3Emitted;vec2 position=vertex0Position+vertex2Velocity*age;gl_PointSize=4.0;gl_Position=projection*view*vec4(position,0.9,1.0);color=vec4(vertex1Color,1.0-smoothstep(0.0,vertex4Lifetime,age));}",s="precision highp float;varying vec4 color;void main(){gl_FragColor=color;}",h="uniform mat4 projection;attribute vec2 vertex0Position;attribute vec2 vertex1TexCoord;attribute float vertex2Size;varying float size;varying vec2 texCoord;void main(){gl_PointSize=vertex2Size;gl_Position=projection*vec4(vertex0Position,0.95,1.0);size=vertex2Size;texCoord=vertex1TexCoord;}",r="precision highp float;uniform sampler2D tex;varying float size;varying vec2 texCoord;void main(){if(size<0.1){discard;}vec2 texCoord=mix(texCoord,texCoord+vec2(8.0/128.0,8.0/64.0),gl_PointCoord);gl_FragColor=texture2D(tex,texCoord);if(gl_FragColor.a<0.1){discard;}}";const a=(t,e)=>{switch(e){case t.FLOAT:return 1;case t.FLOAT_VEC2:return 2;case t.FLOAT_VEC3:return 3;case t.FLOAT_VEC4:return 4;case t.FLOAT_MAT3:return 9;case t.FLOAT_MAT4:return 16}};class n{constructor(t,e,i){this.gl=t;const s=t.createShader(t.VERTEX_SHADER);t.shaderSource(s,e),t.compileShader(s);const h=t.createShader(t.FRAGMENT_SHADER);t.shaderSource(h,i),t.compileShader(h),this.program=t.createProgram(),t.attachShader(this.program,s),t.attachShader(this.program,h),t.linkProgram(this.program),this.uniforms=[];const r=t.getProgramParameter(this.program,t.ACTIVE_UNIFORMS);for(let e=0;e<r;e++){const i=t.getActiveUniform(this.program,e),s=t.getUniformLocation(this.program,i.name);this[i.name]=null,this.uniforms.push({type:i.type,name:i.name,location:s})}this.attributes=[],this.stride=0;const n=t.getProgramParameter(this.program,t.ACTIVE_ATTRIBUTES);for(let e=0;e<n;e++){const i=t.getActiveAttrib(this.program,e),s=t.getAttribLocation(this.program,i.name),h=a(t,i.type);this.attributes.push({name:i.name,location:s,components:h}),this.stride+=4*h}this.attributes.sort((t,e)=>t.name<e.name?-1:1)}use(){this.gl.useProgram(this.program);let t=0;for(const e of this.attributes)this.gl.enableVertexAttribArray(e.location),this.gl.vertexAttribPointer(e.location,e.components,this.gl.FLOAT,!1,this.stride,t),t+=4*e.components;for(const t of this.uniforms)switch(t.type){case this.gl.FLOAT:this.gl.uniform1f(t.location,this[t.name]);break;case this.gl.FLOAT_VEC2:this.gl.uniform2fv(t.location,this[t.name]);break;case this.gl.FLOAT_MAT2:this.gl.uniformMatrix2fv(t.location,!1,this[t.name]);break;case this.gl.FLOAT_MAT4:this.gl.uniformMatrix4fv(t.location,!1,this[t.name])}}}class l{constructor(t,e=null,i=!1){this.timeout=t,this.callback=e,this.repeating=i,this.progress=0,this.enabled=!0}update(){this.enabled&&(this.progress+=1e3/60,this.progress>=this.timeout&&(this.repeating?this.progress-=this.timeout:this.enabled=!1,this.callback&&this.callback()))}reset(){this.enabled=!0,this.progress=0}}class o{constructor(a){const o=document.createElement("canvas");o.width=1024,o.height=600,document.body.appendChild(o),this.gl=o.getContext("webgl",{antialias:!1}),this.gl.enable(this.gl.DEPTH_TEST),this.gl.enable(this.gl.BLEND),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA),this.gl.clearColor(0,.53,1,1),this.spriteShader=new n(this.gl,t,e),this.particleShader=new n(this.gl,i,s),this.textShader=new n(this.gl,h,r),this.projection=new Float32Array([2/1024,0,0,0,0,-2/600,0,0,0,0,-1,0,-1,1,0,1]),this.view=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),this.cameraX=0,this.cameraY=0,this.texture=this.gl.createTexture(),this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),this.setUpTexture();const c=new Image;c.addEventListener("load",()=>{this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,c),this.setUpTexture(),a.loaded=!0}),c.crossOrigin="",c.src="textures/tiles.png",this.shakeTimer=new l(200),this.shakeTimer.enabled=!1,this.shakeIntensity=10}setUpTexture(){this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST)}createVertexBuffer(t){const e=this.gl.createBuffer();return this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,t,this.gl.STATIC_DRAW),e}updateVertex(t,e,i){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferSubData(this.gl.ARRAY_BUFFER,e,i)}clear(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}shake(t=10){this.shakeIntensity=t,this.shakeTimer.reset()}update(){this.shakeTimer.update(),this.view[12]=-Math.round(this.cameraX),this.view[13]=-Math.round(this.cameraY),this.shakeTimer.enabled&&(this.view[12]+=(Math.random()-.5)*this.shakeIntensity,this.view[13]+=(Math.random()-.5)*this.shakeIntensity)}draw(t,e,i){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),t.projection=this.projection,t.view=this.view,t.use(),this.gl.drawArrays(this.gl.POINTS,0,i)}}const c="ArrowUp",d="ArrowDown",p="ArrowLeft",x="ArrowRight",m="KeyW",u="KeyS",g="KeyA",f="KeyD",B="KeyX",b="KeyZ",y="KeyK",v="KeyJ",T="Space",S={38:c,40:d,37:p,39:x,87:m,65:g,83:u,68:f,88:B,90:b,75:y,74:v,32:T};class A{constructor(){this.keysPressed=0,this.lastPressed=0,this.keysJustPressed=0,this.keysJustReleased=0,addEventListener("keydown",t=>{switch(t.code||S[t.keyCode]){case c:case m:this.keysPressed|=1,t.preventDefault();break;case d:case u:this.keysPressed|=2,t.preventDefault();break;case p:case g:this.keysPressed|=4,t.preventDefault();break;case x:case f:this.keysPressed|=8,t.preventDefault();break;case B:case y:case T:this.keysPressed|=32,t.preventDefault();break;case b:case v:this.keysPressed|=64,t.preventDefault()}}),addEventListener("keyup",t=>{switch(t.code||S[t.keyCode]){case c:case m:this.keysPressed&=-2,t.preventDefault();break;case d:case u:this.keysPressed&=-3,t.preventDefault();break;case p:case g:this.keysPressed&=-5,t.preventDefault();break;case x:case f:this.keysPressed&=-9,t.preventDefault();break;case B:case y:case T:this.keysPressed&=-33,t.preventDefault();break;case b:case v:this.keysPressed&=-65,t.preventDefault()}})}update(){this.keysJustPressed=this.keysPressed&~this.lastPressed,this.keysJustReleased=~this.keysPressed&this.lastPressed,this.lastPressed=this.keysPressed}pressed(t){return(this.keysPressed&t)===t}justPressed(t){return(this.keysJustPressed&t)===t}justReleased(t){return(this.keysJustReleased&t)===t}}class E{constructor(){this.active=!1,this.inactivate=!1,this.x=0,this.y=0,this.z=0,this.u=0,this.v=0,this.tint=0,this.oldX=0,this.oldY=0,this.oldZ=0,this.oldU=0,this.oldV=0,this.oldTint=0,this.canFlash=!0,this.flashTimer=new l(100,()=>{0!==this.tint?(this.tint=0,this.flashTimer.reset()):this.canFlash=!0}),this.flashTimer.enabled=!1}spawn(t,e,i,s,h,r,a){this.active=!0,this.x=t,this.y=e,this.z=i,this.u=s,this.v=h,this.tint=0,this.oldX=this.x,this.oldY=this.y,this.oldZ=this.z,this.oldU=this.u,this.oldV=this.v,this.oldTint=this.tint,this.canFlash=!0,r&&(r.init(this),this.controller=r),a&&(this.frames=a,this.currentFrame=0,this.frameDirection=-1,this.frameTimer=new l(100,()=>{this.currentFrame=(this.currentFrame+this.frameDirection)%this.frames.length,this.currentFrame<0&&(this.currentFrame=this.frames.length-1),this.u=this.frames[this.currentFrame][0],this.v=this.frames[this.currentFrame][1]},!0))}update(){this.controller&&this.controller.update(),this.frameTimer&&this.frameTimer.update(),this.flashTimer.update(),this.inactivate&&(this.active=!1,this.inactivate=!1),this.active||(this.x=0,this.y=0,this.z=0,this.u=0,this.v=0,this.tint=0,this.controller=null);const t=this.oldX!==this.x||this.oldY!==this.y||this.oldZ!==this.z||this.oldU!==this.u||this.oldV!==this.v||this.oldTint!==this.tint;return this.oldX=this.x,this.oldY=this.y,this.oldZ=this.z,this.oldU=this.u,this.oldV=this.v,this.oldTint=this.tint,t}flash(){this.canFlash&&(this.canFlash=!1,this.tint=1,this.flashTimer.reset())}disable(){this.inactivate=!0}}const w=8192,k=24;class R{constructor(t){this.renderer=t,this.vertexBuffer=t.createVertexBuffer(w*k),this.spriteVertex=new Float32Array(k/4),this.sprites=[];for(let t=0;t<w;t++)this.sprites.push(new E(t))}updateSprite(t,e){this.spriteVertex[0]=e.active?e.x+32:0,this.spriteVertex[1]=e.active?e.y+32:0,this.spriteVertex[2]=e.active?e.z:0,this.spriteVertex[3]=e.active?e.u:0,this.spriteVertex[4]=e.active?e.v:0,this.spriteVertex[5]=e.active?e.tint:0,this.renderer.updateVertex(this.vertexBuffer,t*k,this.spriteVertex)}spawnSprite(t,e,i,s,h,r=null,a=null){for(let n=0;n<w;n++){const l=this.sprites[n];if(!l.active)return l.spawn(t,e,i,s,h,r,a),this.updateSprite(n,l),l}}update(){for(let t=0;t<w;t++){const e=this.sprites[t];e.active&&e.update()&&this.updateSprite(t,e)}}draw(){this.renderer.draw(this.renderer.spriteShader,this.vertexBuffer,w)}reset(){for(const t of this.sprites)t.disable(),t.update()}}const M=128,L=36;class P{constructor(t){this.renderer=t,this.vertexBuffer=t.createVertexBuffer(M*L),this.particleVertex=new Float32Array(L/4),this.nextIndex=0,this.time=0}emitParticle(t,e,i,s,h,r,a,n){this.particleVertex[0]=t,this.particleVertex[1]=e,this.particleVertex[2]=i,this.particleVertex[3]=s,this.particleVertex[4]=h,this.particleVertex[5]=r,this.particleVertex[6]=a,this.particleVertex[7]=this.time,this.particleVertex[8]=n,this.renderer.updateVertex(this.vertexBuffer,this.nextIndex*L,this.particleVertex),this.nextIndex=(this.nextIndex+1)%M}update(){this.time+=1e3/60}draw(){this.renderer.particleShader.time=this.time,this.renderer.draw(this.renderer.particleShader,this.vertexBuffer,M)}}class C{constructor(t,e,i,s,h,r){if(this.textLayer=t,this.size=i,this.chars=e,this.visible=!0,this.lastVisible=!0,1===s){for(const t of this.chars)t.size=0;this.nextChar=0,this.timer=new l(70,()=>{if(this.nextChar>=this.chars.length)this.timer.enabled=!1;else{this.chars[this.nextChar].size=this.size;for(const t of this.chars)this.textLayer.updateChar(t);this.nextChar++}},!0)}else if(0===s){for(const t of this.chars)t.size=0;this.timer=new l(500,()=>{this.visible=!this.visible},!0)}this.timer&&h&&(this.timer.enabled=!1,this.startTimer=new l(h,()=>{this.timer.enabled=!0,this.endTimer&&(this.endTimer.enabled=!0)}));for(const t of this.chars)this.textLayer.updateChar(t);r&&(this.endTimer=new l(r,()=>{this.hide()}),this.startTimer&&(this.endTimer.enabled=!1))}update(){if(this.startTimer&&this.startTimer.update(),this.timer&&this.timer.update(),this.endTimer&&this.endTimer.update(),this.visible&&!this.lastVisible)for(const t of this.chars)t.size=this.size,this.textLayer.updateChar(t);else if(!this.visible&&this.lastVisible)for(const t of this.chars)t.size=0,this.textLayer.updateChar(t);this.lastVisible=this.visible}hide(){this.visible=!1;for(const t of this.chars)t.size=0,this.textLayer.updateChar(t);this.startTimer&&(this.startTimer.enabled=!1),this.timer&&(this.timer.enabled=!1),this.endTimer&&(this.endTimer.enabled=!1)}}const W=512,I=20;class D{constructor(t){this.renderer=t,this.vertexBuffer=t.createVertexBuffer(W*I),this.charVertex=new Float32Array(I/4),this.nextIndex=0,this.title=null,this.help=null,this.lives=null}set titleText(t){this.title&&this.title.hide(),this.title=t}set helpText(t){this.help&&this.help.hide(),this.help=t}set livesText(t){this.lives&&this.lives.hide(),this.lives=t}updateChar(t){this.charVertex[0]=t.x+t.size/2,this.charVertex[1]=t.y+t.size/2,this.charVertex[2]=t.u,this.charVertex[3]=t.v,this.charVertex[4]=t.size,this.renderer.updateVertex(this.vertexBuffer,t.index*I,this.charVertex)}getUV(t){const e=t.charCodeAt(0);let i=null,s=null;return e>="A".charCodeAt(0)&&e<="P".charCodeAt(0)?(i=8*(t.charCodeAt(0)-"A".charCodeAt(0))/128,s=.75):e>="Q".charCodeAt(0)&&e<="Z".charCodeAt(0)?(i=8*(t.charCodeAt(0)-"Q".charCodeAt(0))/128,s=.875):"<"===t?(i=.625,s=.875):"/"===t&&(i=.6875,s=.875),[i,s]}createSegment(t,e,i,s,h,r,a){let n=[],l=t;for(const h of i)if("\n"===h)e+=s+12,l=t;else{const[t,i]=this.getUV(h);if(null!==t&&null!==i){const h=this.nextIndex;this.nextIndex=(this.nextIndex+1)%W,n.push({index:h,x:l,y:e,u:t,v:i,size:s})}l+=s}return new C(this,n,s,h,r,a)}createCenteredSegment(t,e,i,s,h,r){let a=0;for(const t of e.split("\n")){const e=t.length*i;e>a&&(a=e)}const n=512-a/2;return this.createSegment(n,t,e,i,s,h,r)}update(){this.title&&this.title.update(),this.help&&this.help.update(),this.lives&&this.lives.update()}draw(){this.renderer.draw(this.renderer.textShader,this.vertexBuffer,W)}}class _{speak(t){const e=new SpeechSynthesisUtterance(t);e.rate=1.2,e.pitch=.3,speechSynthesis.speak(e)}}var F="1111111111111111111111111111111111111111111111111111111    G    111111111111111111111111111111111111111111111111111111111111111\n2222222222222222222222222222222222222222222222222222222         222222222222222R                              22222222222222222\n2222222222222222222222222222222222222222222222222222222         222222222222222 22222222222222222222        W 22222222222222222\n2222222222222222222222222222222222222222222222222222222         222222222222222 2222222222222222         2222 22222222222222222\n2222222222222222222222222222222222222222222222222222            BBBB      R     2222222222222222    W         22222222222222222\n2222222222222222222222222222222222222222222222222222            BBBB            2222222222222222 22222        22222222222222222\n2222222222222222222222222222222222222222222222222222  H         BBBB   X        2222222222222222              22222222222222222\n2222222222222222222222222222222222222222222222222222222         22222222222222222222222222222222         22   22222222222222222\n2222222222222222222222222222222222222222222222222222222         22222222222222222222222222222222     W        22222222222222222\n2222222222222222222222222222222222222222222222222222222         22222222222222222222222222222222 22222        22222222222222222\n2222222222222222222222222222222222222222222222222222222         22222222222222222222222222222222          W   22222222222222222\n22222222222222222222222222222  R     R        R                    R       R             2222222        2222  22222222222222222\n2222222222222222222222222222                               P                  222222222  2222222              22222222222222222\n2222222222222222222222222222   22222222222222222222222222222222222222222222222222222222  22222222222222222222 22222222222222222\n22222222222222222222222      W   222222222222222222222222BB22222           W   W   W   W 22222222222222222222 22222222222222222\n2222222222222H           222222     BBBBB          BB      BB222 2222222 222 222 222 222 2222222222      H    22222222222222222\n222222222222222                     BBBBB          BB      BB222 2222222                 2222222222  22222222222222222222222222\n222        W       W    222222222222222BB2222BBB222222222BB22222 22222222222222222222222222      R   22222222222222222222222222\n222     22222  22222    2222222222222BBBB2222BBB2222222222222222                                   2222   222222222222222222222\n222                    22222222222222BB222222            BBBB222               W             222  22      222222222222222222222\n222    2222222222222222B    BB           BBB2222222222BBB2222222222          222           W              222222222222222222222\n222  22222222222222BBBBB    BB           BBB        BB222222BB22                       222222             222222222222222222222\n2222        R    2222222BB2222222BB222BB22222BB222BB222    H  22      W                       22          222222222222222222222\n22222            2222222BB2222222BB222BBBBBBBBB222BBBBBBBBB22B22   2222             W              22222  222222222222222222222\n22222222222     222BBBBB  BBBB2222222222222222222222222222222B22                 22222        W  W        222222222222222222222\n222            2222BB222222BBB              BBB   BB22222BBBBB22                            2222222       222222222222222222222\n222    222222222222BB222222BB222222222222BB2222222BB222222222222                                          222222222222222222222\n2222      R      22222222222222222222BBBBBB2222222    BBB    222      W        2222     W                 222222222222222222222\n22222                R        R     22222222222222222BB2222BB222    222               222                 222222222222222222222\n22222222222222                         R   R   R    2BB2222BB222                            22222         222222222222222222222\n22222222222222222222222222222222222                 222      2222                   W            W        222222222222222222222\n2222222222222222222222222222222222222222222222222   22222BBBB22222               22222        222222     2222222222222222222222\n22222222222222222222222222222222222222222222222222  22222222B  BB22                                     22222222222222222222222\n22222222222222222222222222222222222R                       22222BB22  222222                           222222222222222222222222\n22222222222222222222222222222222222            22222222        22BB2222222222222                      2222222222222222222222222\n2222222222222222222222222222222222  222222222222222222222       2BB           22222222222222222BB222222222222222222222222222222\n22222222222222222222222             222222222222222222222222    222222222222BB22222222222222222                          222222\n2222222222222222222222   22222222222222222222222222222222222222      2222222BB             2222222    W         W  W     222222\n2222222222222222222222 222222222222222222222222222222222222222222222      2222      L      2222    2222      2222222     222222\n2222222222222222222222 22222222222222222222222222222222222222222222222222 2222      2      2222   W     W  W      W  W   222222\n2222222222222222222222                    W     2222222222222222222222222 2222     222     2222 222   222222   2222222   222222\n22222222222222222222222222222222222    2222     222222222222              2222    22222    2222    W     W  W  W         222222\n22222222222222222222222222222222222           W 222222222222 22222222222222222  222222222  2222  222 22222222222         222222\n22222222222222222222222222222222222 2222   2222 222222222222              222222222222222BB2222     W  W  W       W      222222\n22222222222222222222222222222222222             2222222222222222222222222 222222222222222BB2222   222222222    22222     222222\n22222222222222222222222222222222222    2222  22222222             H       22   W  W  W  W  2222                           22222\n222222222        W           W            W     22222 2222222222222222222222 222222222222  222222222222222222222222222222B22222\n22222222      222222      2222        22222222  22222                     BB               222222222222222222  BB     BB B22222\n2222222                                         2222222222222222222222222 22BB2222222222222222222222222222222B22222222222222222\n2222222  2222222222222222222222222222222222222222222222222222222222222222 22BB222222222222222222222  BB      B22222222222222222\n2222222 222222222222222222222                                             22     W    W             222222222222222222222222222\n2222222                        222222222222222222222222222222222222222222222   22222222        W   W     2222222222222222222222\n2222222222222222               222222222222222222222222222222222222222222222                22222222     2222222222222222222222\n22222222222222222             2222222222222222222222222222222222222222222222          W  W  W            2222222222222222222222\n222222222222222222           22222222222222222222222222222222222222222222222        222222222            2222222222222222222222\n22222222222222222222   E   2222222222222222222222222222222222222222222222222                             2222222222222222222222\n2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222\n2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222\n2222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222\n";class V{constructor(t){this.map=t,this.dx=0,this.dy=0,this.ax=0,this.ay=0,this.hitboxX=0,this.hitboxY=0,this.hitboxW=64,this.hitboxH=64,this.maxDx=.5,this.ignoreCollisions=!1}init(t){this.sprite=t}get x(){return this.sprite.x}get y(){return this.sprite.y}set x(t){this.sprite.x=t}set y(t){this.sprite.y=t}get left(){return this.x+this.hitboxX}get right(){return this.x+this.hitboxX+this.hitboxW-1}get top(){return this.y+this.hitboxY}get bottom(){return this.y+this.hitboxY+this.hitboxH-1}update(){this.dx+=this.ax*(1e3/60),this.dy+=this.ay*(1e3/60),this.dx>this.maxDx?this.dx=this.maxDx:this.dx<-this.maxDx&&(this.dx=-this.maxDx),this.dy>2?this.dy=2:this.dy<-2&&(this.dy=-2),this.x+=this.dx*(1e3/60),!this.ignoreCollisions&&this.tileAt()&&(this.dx<0?this.x+=this.map.prevTileOffset(this.left):this.x-=this.map.nextTileOffset(this.right)+1),this.y+=this.dy*(1e3/60),!this.ignoreCollisions&&this.tileAt()&&(this.dy<0?this.y+=this.map.prevTileOffset(this.top):this.y-=this.map.nextTileOffset(this.bottom)+1)}tileAt(t=0,e=0){return this.map.tileAt(this.left+t,this.top+e)||this.map.tileAt(this.left+t,this.bottom+e)||this.map.tileAt(this.right+t,this.top+e)||this.map.tileAt(this.right+t,this.bottom+e)}laserHit(){return!1}}class O extends V{constructor(t,e,i,s){super(t),this.spriteSheet=i,this.particleSystem=s,this.hitboxX=12,this.hitboxY=16,this.hitboxW=40,this.hitboxH=12,this.dx=8===e?.75:-.75,this.maxDx=1,this.ignoreCollisions=!0}update(){if(super.update(),this.tileAt())return this.sprite.disable(),void this.explode();for(const t of this.spriteSheet.sprites)if(t.controller&&!(t.controller.left>this.right||t.controller.right<this.left||t.controller.top>this.bottom||t.controller.bottom<this.top)&&t.controller.laserHit())return this.sprite.disable(),void this.explode();const t=this.dx>0?this.left:this.right,e=Math.random()>.5,i=e?0:.66,s=e?0:1,h=e?.66:.93;Math.random()>.6&&this.particleSystem.emitParticle(t,this.top+this.hitboxH/2+(Math.random()-.5)*this.hitboxH,i,s,h,0,0,500)}explode(){for(let t=0;t<20;t++){const t=Math.random()>.5,e=t?0:.66,i=t?0:1,s=t?.66:.93;this.particleSystem.emitParticle(this.left+Math.random()*this.hitboxW,this.top+Math.random()*this.hitboxH,e,i,s,.25*(Math.random()-.5),.25*(Math.random()-.5),200)}}}class N extends V{constructor(t,e,i,s,h,r,a,n){super(i),this.game=t,this.renderer=e,this.spriteSheet=s,this.input=h,this.particleSystem=r,this.textLayer=a,this.speech=n,this.abilities={propulsion:!1,elevation:!1,excavation:!1,extermination:!1},this.loaded=!1,this.direction=0,this.lastDirection=0,this.facing=8,this.lives=3,this.invincible=!1,this.invincibilityTimer=new l(1e3,()=>{this.invincible=!1}),this.invincibilityTimer.enabled=!1}init(t){super.init(t),this.renderer.cameraX=this.x+32-512,this.renderer.cameraY=this.y+32-300,this.lastPlatform=this.y}update(){this.loaded||(this.updateLives(),this.loaded=!0);const t=this.tileAt(-1,0),e=this.tileAt(1,0),i=this.tileAt(0,-1),s=this.tileAt(0,1);if(s?(this.ay=0,this.dy=0,this.y-this.lastPlatform>250&&this.renderer.shake(),this.lastPlatform=this.y):i||this.dy<0&&!this.input.pressed(32)?(this.ay=.002,this.dy=0):this.ay=.002,this.input.pressed(4)&&this.abilities.propulsion?(this.ax>0&&(this.ax=0),t?(this.dx=0,this.ax=0,this.abilities.excavation&&this.input.pressed(64)&&t.drill&&(this.renderer.shake(5),this.drill(4),t.drill())):this.ax-=.001,this.direction=-1,this.lastDirection=0,this.facing=4):this.input.pressed(8)&&this.abilities.propulsion?(this.ax<0&&(this.ax=0),e?(this.dx=0,this.ax=0,this.abilities.excavation&&this.input.pressed(64)&&e.drill&&(this.renderer.shake(5),this.drill(8),e.drill())):this.ax+=.001,this.direction=1,this.lastDirection=0,this.facing=8):(0!==this.direction&&(this.ax=-this.ax,this.lastDirection=this.direction,this.direction=0),(this.lastDirection>0&&this.dx<.001||this.lastDirection<0&&this.dx>.001||t||e)&&(this.dx=0,this.ax=0),this.abilities.excavation&&this.input.pressed(1)&&this.input.pressed(64)&&i&&i.drill?(this.renderer.shake(5),this.drill(1),i.drill()):this.abilities.excavation&&this.input.pressed(2)&&this.input.pressed(64)&&s&&s.drill&&(this.renderer.shake(5),this.drill(2),s.drill())),this.abilities.extermination&&this.input.justPressed(64)){const t=8===this.facing?0:-40;this.spriteSheet.spawnSprite(this.x+this.hitboxW/2+t,this.y,.1,0,2,new O(this.map,this.facing,this.spriteSheet,this.particleSystem))}this.ax>.002?this.ax=.002:this.ax<-.002&&(this.ax=-.002),this.input.justPressed(32)&&0===this.ay&&this.abilities.elevation&&(this.dy=-.9),super.update(),this.dx<-.1?this.kickUpDirt(this.x+64-2,s):this.dx>.1&&this.kickUpDirt(this.x+1,s),this.sprite.frameTimer.timeout=s?100:40,this.sprite.frameTimer.enabled=0!==this.direction,this.sprite.frameDirection=Math.sign(this.direction),this.renderer.cameraX=this.x+32-512,this.renderer.cameraY=this.y+32-300,this.invincibilityTimer.update()}updateLives(){let t="";for(let e=0;e<Math.max(3,this.lives);e++)t+=this.lives>e?"<":"/";this.textLayer.livesText=this.textLayer.createSegment(10,10,t,32)}damage(){if(!this.invincible&&(this.invincible=!0,this.invincibilityTimer.reset(),this.lives--,this.updateLives(),this.sprite.flash(),1===this.lives&&this.speech.speak("WARNING! DAMAGE CRITICAL!"),this.renderer.shake(),0===this.lives)){this.sprite.disable();for(let t=0;t<100;t++)this.particleSystem.emitParticle(this.left+Math.random()*this.hitboxW,this.top+Math.random()*this.hitboxH,.73,.73,.73,.25*(Math.random()-.5),.25*(Math.random()-.5),700);this.game.over()}}drill(t){const e=30*Math.random();let i=0,s=0;switch(t){case 1:i=this.x+32,s=this.y;break;case 2:i=this.x+32,s=this.y+64;break;case 4:i=this.x,s=this.y+32;break;case 8:i=this.x+64,s=this.y+32}for(let h=0;h<e;h++){let e=0,h=0;switch(t){case 1:e=.5*Math.random()-.25,h=.25*Math.random();break;case 2:e=.5*Math.random()-.25,h=.25*-Math.random();break;case 4:e=.25*Math.random(),h=.5*Math.random()-.25;break;case 8:e=.25*-Math.random(),h=.5*Math.random()-.25}const r=Math.random()<.75,a=r?1:.93,n=r?.46:.93,l=.46;this.particleSystem.emitParticle(i,s,a,n,l,e,h,300)}}kickUpDirt(t,e){if(!e)return;const i=2*Math.random(),s="1"==e?0:.4,h="1"==e?.8:.27,r="1"==e?.33:0,a=t<this.x+32?-1:1;for(let e=0;e<i;e++)this.particleSystem.emitParticle(t,this.y+64-1,s,h,r,a*Math.random()*.25,.25*-Math.random(),200)}}class U extends V{constructor(t,e,i){super(e),this.renderer=t,this.particleSystem=i,this.ignoreCollisions=!0,this.integrity=30}drill(){if(this.integrity--,this.sprite.flash(),this.integrity<=0){for(let t=0;t<100;t++){const t=Math.random()<.75,e=t?1:.93,i=t?.46:.93,s=.46;this.particleSystem.emitParticle(this.left+Math.random()*this.hitboxW,this.top+Math.random()*this.hitboxH,e,i,s,.25*(Math.random()-.5),.25*(Math.random()-.5),700)}this.renderer.shake(20),this.sprite.disable(),this.map.setTileAt(this.x,this.y,null)}}}class X extends V{constructor(t,e,i,s){super(e),this.renderer=t,this.gib=i,this.particleSystem=s,this.hitboxX=8,this.hitboxY=4,this.hitboxW=56,this.hitboxH=20,this.falling=!1,this.xOffset=0,this.yOffset=0,this.timer=new l(200,()=>{this.x=this.baseX,this.y=this.baseY,this.falling=!0}),this.timer.enabled=!1,this.fell=!1}init(t){super.init(t),this.baseX=this.x,this.baseY=this.y}update(){if(!this.fell){if(this.timer.update(),this.gib.left-50>this.right||this.gib.right+50<this.left||this.gib.bottom<this.top||this.gib.top-100>this.bottom||this.falling||(this.timer.enabled=!0),this.timer.enabled){const t=8*Math.random()-4,e=8*Math.random()-4;this.x=this.baseX+t,this.y=this.baseY+e}if(this.falling)if(this.tileAt(0,1)){this.ay=0,this.dy=0,this.falling=!1,this.fell=!0,this.renderer.shake();for(let t=0;t<50;t++)this.particleSystem.emitParticle(this.left+Math.random()*this.hitboxW,this.top+Math.random()*this.hitboxH,.86,.53,.33,.25*(Math.random()-.5),.125*-Math.random(),700)}else this.ay=.007,this.gib.left>this.right||this.gib.right<this.left||this.gib.top>this.bottom||this.gib.bottom<this.top||this.gib.damage()}super.update()}}class Y extends V{constructor(t,e,i,s,h){super(e),this.renderer=t,this.gib=i,this.particleSystem=s,this.parent=h,this.hitboxX=8,this.hitboxY=8,this.hitboxW=48,this.hitboxH=48,this.direction=8,this.tolerance=0}update(){switch(this.direction){case 1:0!==this.tolerance||this.tileAt(9,0)?(this.dx=0,this.dy=-.1):(this.direction=8,this.tolerance=10,this.y=Math.floor(this.y));break;case 2:0!==this.tolerance||this.tileAt(-9,0)?(this.dx=0,this.dy=.1):(this.direction=4,this.tolerance=10,this.y=Math.floor(this.y));break;case 4:0!==this.tolerance||this.tileAt(0,-9)?(this.dx=-.1,this.dy=0):(this.direction=1,this.tolerance=10,this.x=Math.floor(this.x));break;case 8:0!==this.tolerance||this.tileAt(0,9)?(this.dx=.1,this.dy=0):(this.direction=2,this.tolerance=10,this.x=Math.floor(this.x))}this.tolerance--,this.tolerance<0&&(this.tolerance=0),super.update(),this.gib.left>this.right||this.gib.right<this.left||this.gib.top>this.bottom||this.gib.bottom<this.top||this.gib.damage()}laserHit(){return this.parent.laserHit()}explode(){this.sprite.disable();for(let t=0;t<50;t++)this.particleSystem.emitParticle(this.left+Math.random()*this.hitboxW,this.top+Math.random()*this.hitboxH,0,.8,.33,.25*(Math.random()-.5),.25*(Math.random()-.5),200)}}class H extends Y{constructor(t,e,i,s,h){super(t,e,s,h),this.spriteSheet=i,this.health=5}init(t){super.init(t),this.middle=new Y(this.renderer,this.map,this.gib,this.particleSystem,this),this.tail=new Y(this.renderer,this.map,this.gib,this.particleSystem,this),this.spriteSheet.spawnSprite(this.sprite.x-47,this.sprite.y,.1,7,1,this.middle),this.spriteSheet.spawnSprite(this.sprite.x-94,this.sprite.y,.1,7,1,this.tail)}laserHit(){return this.health--,this.sprite.flash(),this.middle.sprite.flash(),this.tail.sprite.flash(),this.health<=0&&(this.explode(),this.middle.explode(),this.tail.explode()),!0}}class z extends V{constructor(t,e,i,s,h,r){super(e),this.renderer=t,this.gib=i,this.particleSystem=s,this.textLayer=h,this.speech=r,this.hitboxX=12,this.hitboxY=24,this.hitboxW=40,this.hitboxH=40}update(){if(!(this.gib.left>this.right||this.gib.right<this.left||this.gib.top>this.bottom||this.gib.bottom<this.top)){this.collected(),this.sprite.disable();const t=50;for(let e=0;e<t;e++){const i=2*Math.PI/t*e;this.particleSystem.emitParticle(this.left+this.hitboxW/2,this.top+this.hitboxH/2,.53,0,0,.2*Math.cos(i)+.05*(Math.random()-.5),.2*Math.sin(i)+.05*(Math.random()-.5),1e3)}}super.update()}}class G extends z{collected(){this.gib.abilities.propulsion=!0,this.textLayer.titleText=this.textLayer.createCenteredSegment(220,"PROPULSION SYSTEM ONLINE",32,1,0,2500),this.textLayer.helpText=this.textLayer.createCenteredSegment(220,"USE THE ARROWS TO MOVE",32,1,2500,2500),this.speech.speak("PROPULSION SYSTEM ONLINE")}}class j extends z{collected(){this.gib.abilities.elevation=!0,this.textLayer.titleText=this.textLayer.createCenteredSegment(220,"ELEVATION SYSTEM ONLINE",32,1,0,2500),this.textLayer.helpText=this.textLayer.createCenteredSegment(220,"PRESS X TO JUMP",32,1,2500,2500),this.speech.speak("ELEVATION SYSTEM ONLINE")}}class K extends z{collected(){this.gib.abilities.excavation=!0,this.textLayer.titleText=this.textLayer.createCenteredSegment(220,"EXCAVATION SYSTEM ONLINE",32,1,0,2500),this.textLayer.helpText=this.textLayer.createCenteredSegment(220,"HOLD Z TO BREAK BRICKS",32,1,2500,2500),this.speech.speak("EXCAVATION SYSTEM ONLINE")}}class J extends z{collected(){this.gib.abilities.extermination=!0,this.textLayer.titleText=this.textLayer.createCenteredSegment(220,"EXTERMINATION SYSTEM ONLINE",32,1,0,2500),this.textLayer.helpText=this.textLayer.createCenteredSegment(220,"PRESS Z TO FIRE",32,1,2500,2500),this.speech.speak("EXTERMINATION SYSTEM ONLINE")}}class Z extends z{collected(){this.gib.lives++,this.gib.updateLives(),this.speech.speak("DAMAGE REPAIRED!")}}class q{constructor(t,e,i,s,h,r,a){const n=new N(t,e,this,i,s,h,r,a);this.tiles=[];const l=F.split("\n");for(let t=0;t<l.length;t++){this.tiles.push([]);for(let s=0;s<l[t].length;s++){const o=l[t][s];let c=null,d=0,p=null;switch(o){case"1":c=0;break;case"2":c=1;break;case"B":c=1,d=1,p=new U(e,this,h);break;case"R":i.spawnSprite(64*s,64*t,.8,6,0,new X(e,this,n,h));break;case"W":i.spawnSprite(64*s,64*t+8,.1,7,0,new H(e,this,i,n,h));break;case"D":i.spawnSprite(64*s,64*t,.8,0,1);break;case"G":i.spawnSprite(64*s,64*t,.7,2,0,n,[[2,0],[3,0],[4,0],[5,0]]);break;case"P":i.spawnSprite(64*s,64*t,.8,2,1,new G(e,this,n,h,r,a));break;case"E":i.spawnSprite(64*s,64*t,.8,3,1,new j(e,this,n,h,r,a));break;case"X":i.spawnSprite(64*s,64*t,.8,4,1,new K(e,this,n,h,r,a));break;case"L":i.spawnSprite(64*s,64*t,.8,5,1,new J(e,this,n,h,r,a));break;case"H":i.spawnSprite(64*s,64*t,.8,2,2,new Z(e,this,n,h,r,a))}null!==c?(i.spawnSprite(64*s,64*t,.1,c,d,p),this.tiles[t].push(p||o)):this.tiles[t].push(null)}}}tileAt(t,e){const i=this.tiles[Math.floor(e/64)];return i?i[Math.floor(t/64)]:null}setTileAt(t,e,i){const s=this.tiles[Math.floor(e/64)];s&&(s[Math.floor(t/64)]=i)}prevTileOffset(t){return 64*(Math.floor(t/64)+1)-t}nextTileOffset(t){return t-64*Math.floor(t/64)}}class Q{constructor(t,e,i){this.input=t,this.textLayer=e,this.speech=i,e.titleText=e.createCenteredSegment(50,"SYSTEMS OFFLINE",64,1),e.helpText=e.createCenteredSegment(200,"PRESS START TO BEGIN",32,0,600),this.loaded=!1,this.started=!1,this.timer=new l(1e3)}update(){this.timer.update(),this.loaded||(this.speech.speak("SYSTEMS OFFLINE"),this.loaded=!0),this.input.justPressed(32)&&!this.timer.enabled&&(this.textLayer.titleText=null,this.textLayer.helpText=null,this.started=!0)}}class ${constructor(t,e,i,s){this.game=t,this.input=e,this.textLayer=i,this.speech=s,i.titleText=i.createCenteredSegment(50,"CRITICAL\nMISSION\nFAILURE",64,1),i.helpText=i.createCenteredSegment(500,"PRESS START TO TRY AGAIN",32,0,2e3),this.speech.speak("CRITICAL MISSION FAILURE!"),this.started=!1,this.timer=new l(2500)}update(){this.timer.update(),this.input.justPressed(32)&&!this.timer.enabled&&(this.textLayer.titleText=null,this.textLayer.helpText=null,this.game.load(),this.started=!0)}}const tt=new class{constructor(){this.renderer=new o(this),this.input=new A,this.spriteSheet=new R(this.renderer),this.particleSystem=new P(this.renderer),this.textLayer=new D(this.renderer),this.speech=new _,this.load(),this.title=new Q(this.input,this.textLayer,this.speech),this.lastTimestamp=0,this.timeAccumulator=0,this.loaded=!1}load(){this.spriteSheet.reset(),this.map=new q(this,this.renderer,this.spriteSheet,this.input,this.particleSystem,this.textLayer,this.speech)}update(t){const e=t-this.lastTimestamp;for(this.lastTimestamp=t,this.timeAccumulator+=e;this.timeAccumulator>=1e3/60;)this.loaded&&(this.input.update(),this.title.started?this.spriteSheet.update():this.title.update(),this.particleSystem.update(),this.textLayer.update(),this.renderer.update()),this.timeAccumulator-=1e3/60}render(){this.renderer.clear(),this.spriteSheet.draw(),this.particleSystem.draw(),this.textLayer.draw()}over(){this.title=new $(this,this.input,this.textLayer,this.speech),this.spriteSheet.update()}},et=t=>{requestAnimationFrame(et),tt.update(t),tt.render()};requestAnimationFrame(et)}();

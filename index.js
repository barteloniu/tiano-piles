const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const ham = new Hammer(canvas)
const fullscreenBtn = document.querySelector("#fullscreenBtn")
const pr = window.devicePixelRatio || 1
const game = new Game()
const icons = {}
const requestFullScreen = document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen
const cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen

let wh

const resize = () => {
    canvas.width = window.innerWidth * pr
    canvas.height = window.innerHeight * pr
    wh = canvas.height / 6
    ctx.font = `${50 * pr}px 'Maven Pro', sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#fcfcfc"
}
window.addEventListener("resize", resize)
resize()

fullscreenBtn.addEventListener("click", () => {
    if(document.webkitFullscreenElement || document.mozFullScreenElement){
        cancelFullScreen.call(document)
    }
    else{
        requestFullScreen.call(document.documentElement)
    }
})

ham.get("swipe").set({direction: Hammer.DIRECTION_ALL})
ham.get("pinch").set({enable: true})

ham.on("swipeleft swiperight swipeup swipedown pinchin pinchout tap", e => {
    if(!game.started){
        game.started = true
        return
    }
    if(e.type == "tap"){
        glowAnim.color = "#ff5f5f"
        glowAnim.step = 0
        glowAnim.enabled = true
    }
    else if(e.type.substr(0, 5) == "swipe"){
        glowAnim.color = "#83ffe6"
        glowAnim.step = 0
        glowAnim.enabled = true
    }
})

const bgGrad = (color, percent) => {
    canvas.style.background = `linear-gradient(#2c2c2c ${percent}%, ${color})`
}

const glowAnim = {
    enabled: false,
    step: 0,
    color: "#ff5f5f"
}

const update = () => {
    if(!game.started) return
    if(glowAnim.enabled){
        if(glowAnim.step <= 10){
            bgGrad(glowAnim.color, 100 - glowAnim.step)
            glowAnim.step += 1
        }
        else if(glowAnim.step <= 20){
            bgGrad(glowAnim.color, glowAnim.step + 80)
            glowAnim.step += 1
        }
        else{
            glowAnim.enabled = false
            glowAnim.step = 0
        }
    }
    let toDel = []
    for(const i in game.notes){
        if(game.notes[i][1] == 100) toDel += i
        else game.notes[i][1] += 0.5
    }
    for(const i of toDel){
        delete game.notes[i]
    }
}
const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if(!game.started){
        ctx.fillText("Tiano Piles", canvas.width / 2, canvas.height / 4)
        return
    }
    let icon
    for(const i in game.notes){
        switch(game.notes[i][0]){
        case "u":
            icon = icons.up
            break
        case "l":
            icon = icons.left
            break
        case "r":
            icon = icons.right
            break
        case "d":
            icon = icons.down
            break
        case "t":
            icon = icons.tap
            break
        }
        ctx.drawImage(icon, canvas.width / 2 - wh / 2, canvas.height / 100 * game.notes[i][1], wh, wh)
        //ctx.fillRect(canvas.width / 2 - wh / 2, canvas.height / 100 * game.notes[i][1], wh, wh)
    }
    //ctx.drawImage(icons.tap, 0, 0)
    ctx.fillRect(0, canvas.height / 10 * 9, canvas.width, 2 * pr)
}
const loop = () => {
    update()
    render()
    requestAnimationFrame(loop)
}

//load images
icons.up = new Image()
icons.up.onload = () => {
    icons.left = new Image()
    icons.left.onload = () => {
        icons.right = new Image()
        icons.right.onload = () => {
            icons.down = new Image()
            icons.down.onload = () => {
                icons.tap = new Image()
                icons.tap.onload = () => {
                    requestAnimationFrame(loop)
                }
                icons.tap.src = "dot-circle.png"
            }
            icons.down.src = "chevron-circle-down.png"
        }
        icons.right.src = "chevron-circle-right.png"
    }
    icons.left.src = "chevron-circle-left.png"
}
icons.up.src = "chevron-circle-up.png"
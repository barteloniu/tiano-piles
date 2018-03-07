const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const ham = new Hammer(canvas)
const fullscreenBtn = document.querySelector("#fullscreenBtn")
const pr = window.devicePixelRatio || 1

let lastGesture = "Tiano Piles"

const resize = () => {
    canvas.width = window.innerWidth * pr
    canvas.height = window.innerHeight * pr
    ctx.font = `${50 * pr}px 'Maven Pro', sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
}
window.addEventListener("resize", resize)
resize()

fullscreenBtn.addEventListener("click", () => {
    const requestFullScreen = document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen
    const cancelFullScreen = document.webkitExitFullscreen || document.mozCancelFullScreen
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
    lastGesture = e.type
})

const update = () => {

}
const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillText(lastGesture, canvas.width / 2, canvas.height / 2)
}
const game = () => {
    update()
    render()
    requestAnimationFrame(game)
}
requestAnimationFrame(game)
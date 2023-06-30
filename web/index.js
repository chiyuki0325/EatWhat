import memberList from './member_list.js'
import {createApp} from 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.esm-browser.prod.min.js'

class Member {
    name
    file_id

    constructor(name, file_id) {
        this.name = name
        this.file_id = file_id
    }
}

function generateMemberList(rawMemberList) {
    let memberList = []
    for (const rawMember of rawMemberList) {
        memberList.push(new Member(rawMember[0], rawMember[1]))
    }
    return memberList
}

function getTimeLiteral() {
    const hour = new Date().getHours()
    return hour >= 0 && hour < 12 ? '中午' : '晚上'
}

const app = createApp({
    data() {
        return {
            members: [],
            timeLiteral: '',
            eatWhatText: '吃什么，吃什么？',
            floatCount: 0,
            pollButtonText: '开始',
            pollCount: 0,
            pollStatus: false,
            showMemberImg: false,
            member: new Member('　', 0),
            interval: null,
            randomMembers: [],
            memberToEatImg: ''
        }
    },
    mounted() {
        this.members = generateMemberList(memberList)
        this.timeLiteral = getTimeLiteral()
        this.floatCount = Math.floor(window.innerHeight / 100)
    },
    methods: {
        startPoll() {
            if (this.pollStatus) {
                this.eatWhatText = '吃什么，吃这个！'
                this.pollButtonText = '不行，换一个'
                this.pollStatus = false
                this.pollCount++
                if (this.member.file_id !== '0') {
                    this.showMemberImg = true
                    this.memberToEatImg = '/images/' + this.member.file_id + '.jpg'
                } else {
                    this.showMemberImg = false
                }
                clearInterval(this.interval)
            } else {
                if (this.pollCount >= 3) {
                    alert('这么作？今天别吃了！')
                } else {
                    this.pollButtonText = '停止'
                    this.pollStatus = true
                    this.interval = setInterval(() => {
                        const index = Math.floor(Math.random() * this.members.length)
                        this.member = this.members[index]
                    }, 50)
                }
            }
        },
        getRandomMember(n) {
            if (this.randomMembers.length <= n) {
                const randomMemberIndex = Math.floor(Math.random() * this.members.length)
                this.randomMembers.push(this.members[randomMemberIndex].name)
            }
            return this.randomMembers[n]
        }
    }
})

app.directive('float', {
    created(element) {
        // apply stylesheets
        element.style.position = "absolute"
        const color = Math.random() * 100 + 120
        element.style.color = `rgb(${color}, ${color}, ${color})`
        element.style.fontSize = Math.random() * 1.2 + 1 + "rem"
    },
    mounted(element) {
        // Get the dimensions of the viewport
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // Set the initial position and velocity of the element
        let x = Math.random() * (viewport.width - element.offsetWidth)
        let y = Math.random() * (viewport.height - element.offsetHeight)
        const initialVelocity = (Math.random() * 3 - 1.5) * (viewport.width / 1200)
        let vx = initialVelocity, vy = initialVelocity

        // Update the position of the element and handle edge collisions
        function updatePosition() {
            // Update the position
            x += vx
            y += vy

            // Check for collisions with the edges
            if (x < 0 || x + element.offsetWidth > viewport.width) {
                // Reverse the horizontal velocity
                vx = -vx
            }
            if (y < 0 || y + element.offsetHeight > viewport.height) {
                // Reverse the vertical velocity
                vy = -vy
            }

            // Apply the updated position to the element
            element.style.left = x + "px"
            element.style.top = y + "px"

            // Call updatePosition() again on the next frame
            requestAnimationFrame(updatePosition)
        }

        // Start the animation
        updatePosition()
    }
})

app.mount('#app')
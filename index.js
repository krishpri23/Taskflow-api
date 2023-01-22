import { posts } from './data.js'

const postFeed = document.getElementById('feed')

function render() {
    let getPosts = ``
    posts.forEach(function (post) {
        console.log(post)
        getPosts += `
        <div class="post">
                        <div class="info">
                            <img class="avatar-img" src="${post.avatar}"
                                alt="Courbet looking at the sideways">
                            <div class="user-info">
                                <h2 class="user-name">${post.name}</h2>
                                <h3 class="user-location">${post.location}</h3>
                            </div>

                        </div>
                        <img class="post-img" src="${post.post}" alt="post pic" srcset="">
                        <div class="post-footer">
                            <div class="icons">
                                <img class="icon-img" src="./images/icon-heart.png" alt="like">
                                <img class="icon-img" src="./images/icon-comment.png" alt="comment">
                                <img class="icon-img" src="./images/icon-dm.png" alt="dm">
                            </div>
                            <p class="like-count">${post.likes} likes</p>
                            <div class="caption">
                                <p class="user-name">${post.username}</p>
                                <p class="caption-text"> ${post.comment} </p>
                            </div>
                        </div>
                    </div>
           <div class="spacing"></div> 
`
    })

    postFeed.innerHTML = getPosts

}

render()
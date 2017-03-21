
class Gallery {
  constructor(userCount) {
    this.users = [];
    this.loadedAlbumCount = 0;
    this.userCount = userCount;
    this.jsonUrl = 'https://jsonplaceholder.typicode.com';
    this.setUser = this.setUser.bind(this);
    for (let i = 0; i < userCount; i++) {
      this.loadUser(i+1);
    }
  }

  buildAlbums() {
    this.users.forEach((user) => {
      let albumHtml = this.buildUserAlbums(user);
      $('#root').append(`
        <h2>${user.name}</h2>
        <ul class='user-gallery'>
          ${albumHtml}
        </ul>`)
    });
    // $('.album').forEach((album) => {album.ondragstart = this.dragAlbum});
    $('.album').on("dragstart", this.dragAlbum);
  }

  dragAlbum(ev) {
    debugger;
  }

  buildUserAlbums(user) {
    let html = '';
    let dragAlbum = this.dragAlbum;
    const onDragStart = function(ev) {
      this.dragAlbum(ev);
    }
    user.albums.forEach((album) => {
      html += `<li class='album' draggable='true'>
          <h3 class='album-id'>${album.id}</h3>
          <h3 class='album-title'>${album.title}</h3>
        </li>`
    });
    return html;
  }

  loadUser(userId) {
    $.ajax({
      url: this.jsonUrl + `/users/${userId}`,
      method: 'GET'
    }).then(data => {
      this.setUser(data)
      this.loadAlbumByUser(userId)
    });
  }

  loadAlbumByUser(userId) {
    $.ajax({
      url: this.jsonUrl + `/users/${userId}/albums`,
      method: 'GET'
    }).then(data => {
      this.users[userId-1].albums = data;
      this.loadedAlbumCount += 1
      if(this.loadedAlbumCount === this.userCount) {
        this.buildAlbums();
      }
    });
  }

  setUser(data) {
    this.users.push(data);
  }
}


new Gallery(2);

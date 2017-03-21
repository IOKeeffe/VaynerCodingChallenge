
class Gallery {
  constructor(userCount) {
    this.users = [];
    this.loadedAlbumCount = 0;
    this.userCount = userCount;
    this.jsonUrl = 'https://jsonplaceholder.typicode.com';
    this.setUser = this.setUser.bind(this);
    this.dropAlbum = this.dropAlbum.bind(this);
    this.dragAlbum = this.dragAlbum.bind(this);
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
    this.addDragListeners();
  }

  addDragListeners() {
    $('.album').on('drop', this.dropAlbum);
    $('.album').on('dragstart', this.dragAlbum);
    $('.user-gallery').on('dragover', this.allowDrop)
  }

  dragAlbum(ev) {
    this.dragging = ev.target;
  }


  allowDrop(ev) {
    ev.preventDefault();
  }

  dropAlbum(ev) {
    ev.preventDefault();
    this.changeAlbumOwner(this.dragging, ev.target);
  }

  changeAlbumOwner(oldAlbum, newAlbum) {
    oldAlbum.userId = newAlbum.userId;
    $.ajax({
      method: 'PATCH',
      url: url: this.jsonUrl + `/albums/${oldAlbum.id}`,
      data: oldAlbum
    }).then(data => {
      debugger;
    })
  }

  buildUserAlbums(user) {
    let html = '';
    let dragAlbum = this.dragAlbum;
    const onDragStart = function(ev) {
      this.dragAlbum(ev);
    }
    user.albums.forEach((album) => {
      html += `<li class='album' id=${'album-' + album.id} draggable='true'>
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

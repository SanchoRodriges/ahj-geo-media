import Validator from "./validate";

export default class Notes {
  constructor() {
    this.notesDiv = document.querySelector(".notes");
    this.addNoteForm = document.querySelector(".add-note-form");
    this.modal = document.querySelector(".modal");
    this.getGeo();
    this.events();
  }

  // получаем координаты при открытии страницы
  getGeo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (data) => {
          const { latitude, longitude } = data.coords;
          this.coords = latitude + ", " + longitude;
        },
        (err) => {
          this.modal.classList.add("active");
        },
        { enableHighAccuracy: true }
      );
    }
  }

  // обработка событий
  events() {
    this.addNoteForm.addEventListener("submit", this.addNote);

    const addGeoFormOk = this.modal.querySelector(".ok-form-btn");
    addGeoFormOk.addEventListener("click", this.addGeoForm);

    const addGeoFormCancel = this.modal.querySelector(".cancel-form-btn");
    addGeoFormCancel.addEventListener("click", this.cancelGeoForm);
  }

  // отправка формы добавления заметки
  addNote = (e) => {
    e.preventDefault();

    const addNoteInput = document.querySelector(".add-note-data");

    if (addNoteInput.value === "") {
      this.errorMessage(e.target, "Пожалуйста, добавьте текст");
      return;
    }

    if (!this.coords) {
      this.errorMessage(
        e.target,
        "Пожалуйста, разрешите доступ к местоположению"
      );
      return;
    }

    const message = addNoteInput.value;
    const time = Date.now();

    this.addDOMNote(message, time, this.coords);
    addNoteInput.value = "";
  };

  // получение координат через форму
  // eslint-disable-next-line
  addGeoForm = (e) => {
    e.preventDefault();

    const addGeoFormInput = this.modal.querySelector(".geo-form-input");

    if (addGeoFormInput.value === "") {
      this.errorMessage(addGeoFormInput, "Поле не может быть пустым");
      return;
    }

    if (!Validator.geoValidate(addGeoFormInput.value)) {
      this.errorMessage(
        addGeoFormInput,
        "Указанные координаты не соответствуют формату"
      );
      return;
    }

    this.coords = addGeoFormInput.value;
    addGeoFormInput.value = "";
    this.modal.classList.remove("active");
  };

  // кнопка отмена в форме получения координат
  // eslint-disable-next-line
  cancelGeoForm = (e) => {
    e.preventDefault();
    const addGeoFormInput = this.modal.querySelector(".geo-form-input");
    addGeoFormInput.value = "";
    this.modal.classList.remove("active");
  };

  // добавление заметки в список
  addDOMNote(message, time, coords) {
    const html = `
    <div class="note">
      <div class="main">
        <div class="content">
          ${message}
        </div>
        <div class="geo">[${coords}]</div>
      </div>
      <div class="time">${this.timeToStr(time)}</div>
    </div>
    `;

    this.notesDiv.insertAdjacentHTML("afterbegin", html);
  }

  // обработка времени из timestamp в строку
  timeToStr(timestamp) {
    let time = new Date(timestamp);
    let year = time.getFullYear();
    let month =
      time.getMonth() < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
    let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    let minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return date + "." + month + "." + year + " " + hours + ":" + minutes;
  }

  // сообщение об ошибке
  errorMessage(element, message) {
    const { x, y } = element.getBoundingClientRect();

    const div = document.createElement("div");
    div.classList.add("error");
    div.style.top = y - 30 + "px";
    div.style.left = x - 5 + "px";
    div.innerHTML = message;
    document.body.insertAdjacentElement("beforeend", div);

    setTimeout(() => {
      div.remove();
    }, 2000);
  }
}

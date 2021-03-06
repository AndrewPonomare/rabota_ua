// const link = `https://cors-anywhere.herokuapp.com/https://api.el.ua/vacancy/search?keyWords=frontend`;
const link = `./vacancy.json`;
const root = document.getElementById('vacancy')


UPLOADCARE_LOCALE = "ru";
UPLOADCARE_PUBLIC_KEY = '7396115f1b5ea63a0d84';
UPLOADCARE_LOCALE_TRANSLATIONS = {

}

UPLOADCARE_LOCALE_TRANSLATIONS = {
    buttons: {
        choose: {
            images: {
                one: 'Откликнуться'
            }
        }
    },
    errors: {
        fileMaximumSize: '',
    },

}

const getSearch = async () => {
    const headers = {'Access-Control-Allow-Origin': '*'}
    const res = await axios.get(link, headers);
    const body = await res.data.documents;



    let paginations = document.querySelector('#pagination')
    let notesOnPage = 10;
    let countOfItems = Math.ceil(body.length / notesOnPage)



    console.log(body);

    const showPage = (function () {
        let active;

        return function (item) {
            if (active) {
                active.classList.remove('active');
            }
            active = item;

            item.classList.add('active')

            let pageNum = +item.innerHTML;


            let start = (pageNum - 1) * notesOnPage;
            let end = start + notesOnPage;

            let notes = body.slice(start, end);

            root.innerHTML = ' '

            notes.map(el => {


                if (el.hot == true) {
                    el.hot = 'Горящая'
                } else {
                    el.hot = 'Новая'
                }

                if (el.salary == false) {
                    el.salary = "По результатам собеседования"
                } else {
                    el.salary = el.salary
                }


                root.insertAdjacentHTML("afterbegin",
                    `<div id="vacancy_container" data-id="${el.id}">
								<div class="card_baner">
									<img class="company_banner" src="${el.designBannerUrl}" alt="">
								</div>
								<div class="card">
									<span class="status">${el.hot}</span>
									<div class="vacancy_description">
										<div>
											<p class="vacancy_name">${el.name}</p>
											<p class="salary">${el.salary}</p>
											<p class="companyName">${el.companyName} <span class="cityName">${el.cityName}</span></p>
										</div>
										<div>
											<img class="company_logo"
											src="https://company-logo-frankfurt.rabota.ua/cdn-cgi/image/w=250/${el.logo}" alt="">
										</div>
									</div>
									<div class="badges">
										<ul class="badges_list"></ul>
									</div>
									<div class="card_respond">
										<div class="card_buttons">
                                                <div>
                                                    <img class="apply-icon" src="./img/Icon-Apply.png"></div>
                                                    <input class="respond" type="hidden" role="uploadcare-uploader"
                                                        data-max-size="1048576"
                                                        data-min-size="102400"
                                                        data-public-key="demopublickey"
                                                        data-images-only/>
                                                    <img class="like" src="./img/star.png">
                                                    <img class="dislike" src="./img/dislike.png">
                                                    <div class="apply">
                                                        <p class="respond_txt"></p> 
                                                        <a class="cv" href=''></a>
                                                     </div>
                                                </div>
                                                <div>
                                                    <p class="publication_time">${el.dateTxt}</p>
                                                </div>
										</div>
									</div>
                                    <div class="error_msg">
                                        <img src=./img/attention.png>
                                        <p>Ёлки-палки, этот файл просто огромный и не помещается в наш сервер</p>
                                    </div>
								</div>
							</div>`
                );

                el.badges.map(b => {
                    document.querySelector('.badges_list').insertAdjacentHTML('beforeend', `
								<li class="badges_list_item">${b.name}</li>`)
                })

                const cards = document.querySelectorAll('#vacancy_container')

                cards.forEach(l => {
                    let like = l.querySelector('.like')
                    let dislike = l.querySelector('.dislike')
                    let status = l.querySelector('.status')


                    if (localStorage.getItem(l.dataset.id) == 'true') {
                        l.style.filter = 'none';
                        like.src = "./img/star_true.png"
                        status.innerHTML = 'Избранная'
                        l.style.opacity = 1

                    } else if (localStorage.getItem(l.dataset.id) == 'false') {

                        l.style.opacity = 0.5
                        status.style.backgroundColor = '#C8D1D6'
                        dislike.src = "./img/dislike_true.png"
                        status.innerText = 'Не интересная'
                        status.style.color = '#303A3E'
                    }

                    like.addEventListener('click', () => {

                        like.src = "./img/star_true.png"
                        dislike.src = "./img/dislike.png"
                        l.style.filter = 'none'
                        l.style.opacity = 1
                        localStorage.setItem(l.dataset.id, 'true')
                        status.innerHTML = 'Избранная'
                        status.style.backgroundColor = '#FFE9E9'
                        status.style.color = '#BC0002'

                    })


                    dislike.addEventListener('click', () => {

                        dislike.src = "./img/dislike_true.png"
                        like.src = "./img/star.png"
                        l.style.opacity = 0.5
                        localStorage.setItem(l.dataset.id, 'false')
                        status.innerHTML = 'Не интересная'
                        status.style.backgroundColor = '#C8D1D6'
                        status.style.color = '#303A3E'

                    })

                    const widgets = uploadcare.initialize();
                    const errorMsg = l.querySelector('.error_msg')
                    const iconApply = l.querySelector('.apply-icon')
                    const apply = l.querySelector('.apply')
                    const respondTxt = l.querySelector('.respond_txt')
                    const cv = l.querySelector('.cv')
                    const widgetBtn = l.querySelector('.uploadcare-widget')

                    widgets.forEach(widget => {

                        widget.validators.push(function (fileInfo) {
                            apply.style.display = 'flex'
                            iconApply.style.display = 'none'

                            if (fileInfo.size !== null && fileInfo.size > 1024 * 1024) {
                                errorMsg.style.display = 'flex'
                                throw new Error("fileMaximumSize");
                            } else {
                                errorMsg.style.display = 'none'
                            }
                        });

                    
                        widget.onUploadComplete(fileInfo => {
                            localStorage.setItem(l.dataset.id, 'apply')
                            localStorage.setItem('id', fileInfo.name,)
                            localStorage.setItem('url', fileInfo.cdnUrl)
                            respondTxt.innerHTML = 'отправлено резюме'
                            cv.href = fileInfo.cdnUrl
                            cv.innerHTML = "«" + fileInfo.name.slice(0, -4) + "»"
                            widgetBtn.style.display = 'none'
                            iconApply.style.display = 'none'
                           
                           
                        });

                            if (localStorage.getItem(l.dataset.id) == 'apply') {
                                apply.style.display = 'flex';
                                respondTxt.innerHTML = 'отправлено резюме'
                                cv.href = localStorage.getItem('url')
                                cv.innerHTML = "«" +localStorage.getItem('id').slice(0, -4) + "»"
                                widgetBtn.style.display = 'none'
                                iconApply.style.display = 'none'
                            }
 
                    })

                })
            })
        };
    }());


    let items = [];

    for (let i = 1; i < countOfItems + 1; i++) {
        let li = document.createElement('li');
        li.innerHTML = i;
        paginations.appendChild(li)
        items.push(li)
    }

    showPage(items[0]);

    for (let item of items) {
        item.addEventListener('click', function () {
            showPage(this);
        });
    }

};


getSearch();

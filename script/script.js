// const link = `https://cors-anywhere.herokuapp.com/https://api.el.ua/vacancy/search?keyWords=frontend`;
const link = `./vacancy.json`;
const root = document.getElementById('vacancy')


UPLOADCARE_LOCALE = "ru";
UPLOADCARE_PUBLIC_KEY = '7396115f1b5ea63a0d84';
UPLOADCARE_LOCALE_TRANSLATIONS = {
    buttons: {
        choose: {
            images: {
                one: 'Откликнуться'
            }
        }
    }
}



const getSearch = async () => {
    const res = await axios.get(link);
    const body = await res.data.documents;


    let paginations = document.querySelector('#pagination')
    let notesOnPage = 5;
    let countOfItems = Math.ceil(body.length / notesOnPage)

    body.map(ds => {
        ds.isDislike = false
    })

    console.log(body);

    let showPage = (function () {
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
                    `<div id="vacancy_container">
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
                                                    <input type="hidden" role="uploadcare-uploader"
                                                        data-public-key="demopublickey"
                                                        data-images-only/>
                                                    <img class="like" src="./img/star.png">
                                                    <img class="dislike" src="./img/dislike.png">
                                                </div>
                                                <div>
                                                    <p class="publication_time">${el.dateTxt}</p>
                                                </div>
										</div>
									</div>
								</div>
							</div>`
                );

                el.badges.map(b => {
                    document.querySelector('.badges_list').insertAdjacentHTML('beforeend', `
								<li class="badges_list_item">${b.name}</li>`)
                })
                let like = document.querySelector('.like')
                let dislike = document.querySelector('.dislike')
                console.log(el.isLiked);

                like.addEventListener('click', () => {
                    el.isLiked = true
                    if (el.isLiked == true) {
                        like.src = "./img/star_true.png"
                        dislike.src = "./img/dislike.png"
                        el.isDislike = false
                    }
                })

                dislike.addEventListener('click', () => {
                    el.isDislike = true
                    if (el.isDislike == true) {
                        dislike.src = "./img/dislike_true.png"
                        like.src = "./img/star.png"
                        el.isLiked = false
                        el.hot = "aewrg"
                    }
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

    const widgets = uploadcare.initialize();

    widgets.forEach(widget => {
        widget.onUploadComplete((fileInfo) => {

        })
    })

};




getSearch();

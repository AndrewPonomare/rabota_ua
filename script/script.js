// const link = `https://cors-anywhere.herokuapp.com/https://api.el.ua/vacancy/search?keyWords=frontend`;
const link = `./vacancy.json`;
const root = document.getElementById('vacancy')


const getSearch = async () => {
    const res = await axios.get(link);
    const body = await res.data.documents;
    console.log(body);

    body.map(el => {

        let hot = ''
        if (el.hot == true) {
            hot = 'Горящая'
        } else {
            hot = 'Новая'
        }

        if (el.salary == false) {
            el.salary = "По результатам собеседования"
        } else {
            el.salary = el.salary + " $"
        }

        root.insertAdjacentHTML("afterbegin",
            `<div class="vacancy_container">
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
                            <img class="company_logo" src="https://company-logo-frankfurt.rabota.ua/cdn-cgi/image/w=250/${el.logo}" alt="">
                        </div>
                    </div>
                    <div class="badges">
                        <ul class="badges_list"></ul>
                    </div>
                    <div class="card_respond">
                        <div class="card_buttons">
                            <button class="respond_button"><img src="./img/Icon-Apply.png">Откликнуться</button>
                            <button class ="button_status"><img class="like" src="./img/star.png"></button>
                            <button class ="button_status"><img class="dislike" src="./img/dislike.png"></button>
                        </div>
                        <p class="publication_time">${el.dateTxt}</p>
                    </div>
                </div>
            </div>`
        );


        el.badges.map(b => {

            document.querySelector('.badges_list').insertAdjacentHTML('beforeend', `
                <li class="badges_list_item">${b.name}</li>`)
        }
        )
    }
    )
    respondToVac()
};

function respondToVac() {
    let cards = document.querySelectorAll('.vacancy_container');

    cards.forEach(card => {
        let like_box = card.querySelector('.like');
        let dislike_box = card.querySelector('.dislike')

        like_box.addEventListener('click', () => {
            if (like_box.src == "./img/star_true.png") {
                like_box.src = "./img/star.png"
            } else {
                like_box.src = "./img/star_true.png"
            }

        });

        dislike_box.addEventListener('click', () => {

            if (dislike_box.src == "./img/dislike_true.png") {
                dislike_box.src = "./img/dislike.png"
            } else {
                dislike_box.src = "./img/dislike_true.png"
            }

        })
    }
    )


}



getSearch();

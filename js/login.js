const base_url = 'https://vue3-course-api.hexschool.io/v2';

const app = Vue.createApp({
    data() {
        return {
            user: {
                "username": "",
                "password": ""
            }
        };
    },
    methods: {
        login() {
            if (this.user.username === "" || this.user.password === "") {
                alert(`請先填寫資料再登入`);
                return;
            };
            axios.post(`${base_url}/admin/signin`, this.user)
                .then((res) => {
                    const { expired, token } = res.data;
                    document.cookie = `tokenId=${token}; expires=${new Date(expired)}`;
                    alert(res.data.message);
                    window.location.replace("admin.html");
                })
                .catch((err) => {
                    console.log(err.response.data.message);
                    alert(err.response.data.message)
                })
        }
    },
    mounted() {
    },
})
app.mount('#app');

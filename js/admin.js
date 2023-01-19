const base_url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = `qwe1234`;
let productModal = '';
let delProductModal = '';

import pagination from '/js/pagination.js';

const app = Vue.createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: []
            },
            isNew: true,
            isLoading: true,
            page: {}
        };
    },
    components: {
        pagination,
    },
    methods: {
        checkLogin() {
            axios.post(`${base_url}/api/user/check`)
                .then(res => {
                    this.getProductList();
                    this.isLoading = false
                })
                .catch(err => {
                    console.log(err);
                    alert(err.response.data.message)
                })
        },
        getProductList(page = 1) {
            axios.get(`${base_url}/api/${api_path}/admin/products/?page=${page}`)
                .then(res => {
                    this.page = res.data.pagination;
                    this.products = res.data.products;
                })
                .catch(err => {
                    console.log(err);
                    alert(err.response.data.message)
                })
        },
        openModal(status, product) {
            if (status === 'create') {
                productModal.show();
                this.isNew = true;

                // 資料初始化，因為物件內有陣列，所以一定要重新初始化乾淨才部會出錯
                this.tempProduct = {
                    imagesUrl: []
                }
            } else if (status === 'edit') {
                productModal.show();
                this.isNew = false;
                this.tempProduct = { ...product }
                if (!Array.isArray(this.tempProduct.imagesUrl)) {
                    this.tempProduct.imagesUrl = [];
                    this.tempProduct.imagesUrl.push('');
                }
            } else if (status === 'del') {
                delProductModal.show();
                this.tempProduct = { ...product }
            }
        },
        updateProduct() {

            // 運用變數少一個函式和一個 modal
            let url = `${base_url}/api/${api_path}/admin/product`;
            let method = 'post';
            if (!this.isNew) {
                method = 'put';
                url = `${base_url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
            }
            axios[method](url, { "data": this.tempProduct })
                .then(res => {
                    alert(res.data.message)
                    this.getProductList();
                    productModal.hide();
                })
                .catch(err => {
                    console.log(err.response);
                    alert(err.response.data.message)
                })
        },
        deleteProduct() {
            axios.delete(`${base_url}/api/${api_path}/admin/product/${this.tempProduct.id}`)
                .then(res => {
                    this.getProductList();
                    delProductModal.hide();
                    alert(res.data.message)
                })
                .catch(err => {
                    console.log(err);
                    alert(err.response.data.message)
                })
        },
        toThousands(x) {
            let parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    },
    computed: {
        // toThousands(x) {
        //     let parts = x.toString().split(".");
        //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //     return parts.join(".");
        // }
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)tokenId\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common.Authorization = token;
        this.checkLogin();

        // modal 初始化
        productModal = new bootstrap.Modal('#productModal');
        delProductModal = new bootstrap.Modal('#delProductModal');
    },
})

app.component('product-modal', {
    props: ['tempProduct', 'updateProduct', 'isNew'],
    template: `#product-modal-template`
});
app.component('del-modal', {
    props:['deleteProduct','tempProduct'],
    template: `#delete-modal-template`
})
app.mount('#app');

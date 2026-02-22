import moment from "moment"
export const useFormat = ()=>{
    const formatPrice = (price) => {
        return (price??0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
    const formatCurrency = (price) =>{
        if(price < 1000){
            return (price??0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        else if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
        }
        else if(price >= 1000){
            return `${(price/1000).toFixed(1).toString().replace(/\.0$/, "")}K`
        }
    }
    const isNewProduct = (createdAt) => {
        const createdDate = moment(createdAt);
        const currentDate = moment();
        const oneMonthAgo = currentDate.subtract(1, 'month');
        return createdDate.isSameOrAfter(oneMonthAgo);
    }
    const formatTitle = (title) => {
        return title.replace("_", " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
    }
    const formatTime = (time) => {
        const timeString = moment(time).format('YYYY-MM-DD HH:mm:ss')
        return timeString.replace("T", " ")
    }
    const formatTimeOnly = (date) =>{
        if(!date) return '-'
        return moment(date).format('HH:mm:ss');
    }
    const formatDate = (date) =>{
        if(!date) return '-'
        return moment(date).format('DD-MM-YYYY');
    }
    const filterTwoDigits = (input) => {
        const filtered = input.replace(/[^1-9]/g, '').slice(0, 2);
        const number = parseInt(filtered, 10);
        return number && number < 15 ? number.toString() : '';
    };
    return {
        formatPrice,
        formatCurrency,
        isNewProduct,
        formatTitle,
        formatTime,
        filterTwoDigits,
        formatDate,
        formatTimeOnly 
    }
}
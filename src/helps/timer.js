export function timeAgo(timestamp) {
    const inputDate = new Date(timestamp * 1000);
    const currentDate = new Date();

    const timeDifference = currentDate - inputDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} năm trước`;
    } else if (months > 0) {
        return `${months} tháng trước`;
    } else if (days > 0) {
        return `${days} ngày trước`;
    } else if (hours > 0) {
        return `${hours} giờ trước`;
    } else if (minutes > 0) {
        return `${minutes} phút trước`;
    } else {
        return 'vừa xong';
    }
}

export function convertToDate(timestamp) {
    const dateOfBirth = new Date(timestamp * 1000);

    const day = dateOfBirth.getDate();
    const month = dateOfBirth.getMonth() + 1;
    const year = dateOfBirth.getFullYear();

    return `${day}/${month}/${year}`;
}

export function convertToTime(timestamp) {
    const dateOfBirth = new Date(timestamp * 1000);

    const day = String(parseInt(dateOfBirth.getDate())).padStart(2, '0');
    const month = String(parseInt(dateOfBirth.getMonth() + 1)).padStart(2, '0');
    const year = dateOfBirth.getFullYear();

    return `${year}-${month}-${day}`;
}

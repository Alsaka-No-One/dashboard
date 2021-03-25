class Utils {
    static getRandomStr(
        len = 16,
        chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    ) {
        return Array(len)
            .fill()
            .map(_ => chars[parseInt(Math.random() * chars.length)])
            .join("");
    }

    static unassign(obj, ...keys) {
        obj = {...obj};
        keys.forEach(key => {
            delete obj[key];
        });
        return obj;
    }

    static querify(obj) {
        return Object.entries(obj)
            .map(pair => pair.map(encodeURIComponent).join("="))
            .join("&");
    }

    static unquerify(str) {
        return Object.fromEntries(
            str.split("&")
            .map(el => el.split("=").map(decodeURIComponent))
        )
    }
}

module.exports = Utils;

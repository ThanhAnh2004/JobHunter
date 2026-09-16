import { grey, green, blue, red, orange } from '@ant-design/colors';

export const SKILLS_LIST =
    [
        { label: "React.JS", value: "REACT.JS" },
        { label: "React Native", value: "REACT NATIVE" },
        { label: "Vue.JS", value: "VUE.JS" },
        { label: "Angular", value: "ANGULAR" },
        { label: "Nest.JS", value: "NEST.JS" },
        { label: "TypeScript", value: "TYPESCRIPT" },
        { label: "Java", value: "JAVA" },
        { label: "Java Spring", value: "JAVA SPRING" },
        { label: "Frontend", value: "FRONTEND" },
        { label: "Backend", value: "BACKEND" },
        { label: "Fullstack", value: "FULLSTACK" }
    ];

export const LOCATION_LIST =
    [
        { label: "Hà Nội", value: "HANOI" },
        { label: "Hồ Chí Minh", value: "HOCHIMINH" },
        { label: "Đà Nẵng", value: "DANANG" },
        { label: "Cần Thơ", value: "CANTHO" },
        { label: "Hải Phòng", value: "HAIPHONG" },
        { label: "Bình Dương", value: "BINHDUONG" },
        { label: "Đồng Nai", value: "DONGNAI" },
        { label: "Bà Rịa - Vũng Tàu", value: "VUNGTAU" },
        { label: "Thừa Thiên Huế", value: "HUE" },
        { label: "Khánh Hòa (Nha Trang)", value: "NHATRANG" },
        { label: "Bắc Ninh", value: "BACNINH" },
        { label: "Quảng Ninh", value: "QUANGNINH" },
    ];

export interface ICategoryDef {
    id: string;
    name: string;
    skills: string[];
}

export const CATEGORY_LIST: ICategoryDef[] = [
    {
        id: 'web',
        name: 'Lập Trình Web (Frontend / Backend)',
        skills: ['REACT.JS', 'VUE.JS', 'ANGULAR', 'NODE.JS', 'NEST.JS', 'JAVA', 'JAVA SPRING', 'SPRING BOOT', 'PHP / LARAVEL', 'FRONTEND', 'BACKEND', 'FULLSTACK', 'TYPESCRIPT']
    },
    {
        id: 'mobile',
        name: 'Lập Trình Mobile (iOS / Android / Flutter)',
        skills: ['FLUTTER', 'REACT NATIVE']
    },
    {
        id: 'devops',
        name: 'DevOps & Điện Toán Đám Mây (Cloud)',
        skills: ['DEVOPS', 'DOCKER', 'KUBERNETES', 'AWS']
    },
    {
        id: 'qa_qc',
        name: 'Kiểm Thử Phần Mềm (QA / QC / Tester)',
        skills: ['TESTER']
    },
    {
        id: 'data_ai',
        name: 'Dữ Liệu & Trí Tuệ Nhân Tạo (Data / AI)',
        skills: ['PYTHON', 'DATA ENGINEER', 'AI / ML']
    },
    {
        id: 'cyber_security',
        name: 'An Toàn Thông Tin & Bảo Mật (Security)',
        skills: ['CYBER SECURITY']
    },
    {
        id: 'game_dev',
        name: 'Phát Triển Game (Unity / Unreal / C++)',
        skills: ['C# / .NET']
    },
    {
        id: 'product_ba',
        name: 'Quản Lý Dự Án & Phân Tích (BA / PM / PO)',
        skills: ['BUSINESS ANALYST']
    }
];

export const getCategoryById = (id: string): ICategoryDef | undefined => {
    return CATEGORY_LIST.find(c => c.id.toLowerCase() === id.toLowerCase());
};

export const nonAccentVietnamese = (str: string) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}


export const convertSlug = (str: string) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export const getLocationName = (value: string) => {
    const locationFilter = LOCATION_LIST.filter(item => item.value === value);
    if (locationFilter.length) return locationFilter[0].label;
    return 'unknown'
}

export function colorMethod(method: "POST" | "PUT" | "GET" | "DELETE" | string) {
    switch (method) {
        case "POST":
            return green[6]
        case "PUT":
            return orange[6]
        case "GET":
            return blue[6]
        case "DELETE":
            return red[6]
        default:
            return grey[10];
    }
}

/**
 * Loại bỏ các liên kết Wikipedia, mục [sửa | sửa mã nguồn], số chú thích [1], [2], [cần dẫn nguồn]
 * và chuyển đổi các thẻ <a> thành văn bản thuần túy (unwrap)
 */
export const cleanHtmlDescription = (rawHtml: string | undefined | null): string => {
    if (!rawHtml) return "";

    try {
        if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, "text/html");

            // 1. Loại bỏ các phần tử chứa class edit section / citation của Wikipedia
            const editSections = doc.querySelectorAll(
                '.mw-editsection, .mw-editsection-like, .editsection, .mw-cite-backlink, sup.reference, .reference, .citation'
            );
            editSections.forEach(el => el.remove());

            // 2. Loại bỏ các thẻ <sup> chứa số chú thích như [1], [2], [cần dẫn nguồn]
            const sups = doc.querySelectorAll('sup');
            sups.forEach(sup => {
                const text = sup.textContent?.trim() || "";
                if (/^\[?\s*(\d+|cần\s*dẫn\s*nguồn|citation\s*needed|\w+)\s*\]?$/i.test(text)) {
                    sup.remove();
                }
            });

            // 3. Xử lý thẻ <a>: nếu là nút sửa hoặc chú thích thì xóa hẳn, ngược lại unwrap thành text node
            const allLinks = Array.from(doc.querySelectorAll('a'));
            allLinks.forEach(a => {
                const text = a.textContent?.trim() || "";
                if (
                    /^(sửa|sửa\s*mã\s*nguồn|edit|edit\s*source)$/i.test(text) ||
                    /\[\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*(\|\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*)*\]/i.test(text) ||
                    /^\[\s*\d+\s*\]$/.test(text)
                ) {
                    a.remove();
                } else {
                    const textNode = doc.createTextNode(a.textContent || "");
                    a.replaceWith(textNode);
                }
            });

            let cleanedHtml = doc.body.innerHTML;

            // 4. Xóa triệt để các chuỗi text còn sót lại dạng [sửa | sửa mã nguồn], [sửa], [1], [cần dẫn nguồn]
            cleanedHtml = cleanedHtml.replace(/\[\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*(\|\s*(sửa|sửa\s*mã\s*nguồn|edit|edit\s*source)\s*)*\]/gi, "");
            cleanedHtml = cleanedHtml.replace(/\[\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*\]/gi, "");
            cleanedHtml = cleanedHtml.replace(/\[\s*(cần\s*dẫn\s*nguồn|citation\s*needed)\s*\]/gi, "");
            cleanedHtml = cleanedHtml.replace(/\[\s*\d+\s*\]/g, "");
            cleanedHtml = cleanedHtml.replace(/\[\s*\|\s*\]/g, "");

            // Dọn dẹp khoảng trắng thừa trước dấu câu
            cleanedHtml = cleanedHtml.replace(/\s+([.,;:!?])/g, "$1");

            return cleanedHtml;
        }
    } catch (e) {
        console.error("cleanHtmlDescription error:", e);
    }

    // Fallback regex
    let fallback = rawHtml;
    fallback = fallback.replace(/<a\b[^>]*>(.*?)<\/a>/gi, (match, p1) => {
        if (/^(sửa|sửa\s*mã\s*nguồn|edit|edit\s*source)$/i.test(p1.trim())) return "";
        return p1;
    });
    fallback = fallback.replace(/\[\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*(\|\s*(sửa|sửa\s*mã\s*nguồn|edit|edit\s*source)\s*)*\]/gi, "");
    fallback = fallback.replace(/\[\s*(sửa|sửa\s*mã\s*nguồn|edit)\s*\]/gi, "");
    fallback = fallback.replace(/\[\s*(cần\s*dẫn\s*nguồn|citation\s*needed)\s*\]/gi, "");
    fallback = fallback.replace(/\[\s*\d+\s*\]/g, "");
    fallback = fallback.replace(/\[\s*\|\s*\]/g, "");
    fallback = fallback.replace(/\s+([.,;:!?])/g, "$1");
    return fallback;
};

/**
 * Định dạng thời gian tương đối bằng tiếng Việt chuẩn xác
 */
export const formatRelativeTime = (dateStr: string | Date | undefined | null): string => {
    if (!dateStr) return 'Mới cập nhật';
    const target = new Date(dateStr).getTime();
    if (isNaN(target)) return 'Mới cập nhật';

    const now = Date.now();
    const diffMs = now - target;
    if (diffMs < 0) return 'Vừa xong';

    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Vừa xong';

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} ngày trước`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} tháng trước`;

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} năm trước`;
};

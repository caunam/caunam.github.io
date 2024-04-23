const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa các tệp Markdown
const directoryPath = 'hoiquan';

// Hàm đệ quy để lấy tất cả các tệp Markdown từ thư mục và các thư mục con
function getAllMarkdownFiles(directory) {
    let files = [];

    fs.readdirSync(directory).forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            files = files.concat(getAllMarkdownFiles(filePath));
        } else if (filePath.endsWith('.md') && file.includes(' ')) {
            // Chỉ thêm tệp có chứa khoảng trắng vào danh sách
            files.push(filePath);
        }
    });

    return files;
}

// Hàm để tạo cấu trúc nav từ danh sách các tệp Markdown
function generateNav(markdownFiles) {
    const nav = [];

    markdownFiles.forEach(file => {
        const fileName = path.basename(file, '.md');
        const fileRelativePath = path.relative(directoryPath, file).split(path.sep).join('/');
        const fileNav = {
            [fileName]: toSlug(fileRelativePath)
        };
        nav.push(fileNav);
    });

    return nav;
}

function toSlug(title) {
    // Chuyển hết sang chữ thường
    let slug = title.toLowerCase();

    // Xóa dấu và các ký tự đặc biệt, tạo slug
    slug = slug.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    slug = slug.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    slug = slug.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    slug = slug.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    slug = slug.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    slug = slug.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    slug = slug.replace(/đ/g, 'd');
    slug = slug.replace(/[^a-z0-9 -]/g, ''); // Giữ lại chữ số, chữ cái, khoảng trắng và dấu gạch ngang
    slug = slug.replace(/\s+/g, '-').replace(/-+/g, '-'); // Thay thế khoảng trắng và dấu gạch ngang liên tiếp bằng một dấu gạch ngang

    return slug; // Trả về giá trị đã xử lý
}

// Lấy danh sách tất cả các tệp Markdown có chứa khoảng trắng trong tên
const markdownFiles = getAllMarkdownFiles(directoryPath);

// Tạo cấu trúc nav từ danh sách các tệp Markdown
const nav = generateNav(markdownFiles);

// Tạo nội dung cho tệp mkdocs.yml
let mkdocsContent = 'nav:\n';

nav.forEach(item => {
    const key = Object.keys(item)[0];
    const value = item[key];
    mkdocsContent += `  - ${key}: hoiquan/${value}\n`;
});

// Ghi nội dung vào tệp mkdocs.yml
fs.writeFileSync('mkdocs.yml', mkdocsContent, 'utf8');

console.log("File mkdocs.yml đã được tạo thành công!");

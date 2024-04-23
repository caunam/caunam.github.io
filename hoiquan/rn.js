const fs = require('fs');
const path = require('path');

// Function to convert Vietnamese title to English and generate slug
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

// Function to fix image paths in markdown content
function fixImagePaths(content) {
    // Replace 'assets\' with '../assets/'
    return content.replace(/assets\\/g, '../../assets/');
}

// Function to rename markdown files in a directory and fix image paths
function processMarkdownFiles(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            const fileExt = path.extname(filePath);
            if (fileExt === '.md') {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', err);
                        return;
                    }

                    // Fix image paths
                    const fixedContent = fixImagePaths(data);

                    // Rename file
                    const fileName = path.basename(filePath, fileExt);
                    const newFileName = toSlug(fileName) + fileExt;
                    fs.writeFile(path.join(directoryPath, newFileName), fixedContent, 'utf8', (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            return;
                        }
                        console.log(`${file} renamed to ${newFileName} with fixed image paths`);
                    });
                });
            }
        });
    });
}

// Example directory path
const directoryPath = 'chiasehay';

// Process markdown files in the directory
processMarkdownFiles(directoryPath);

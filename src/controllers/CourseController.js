const CourseService = require('../services/CourseSevice')
const User = require('../models/UserModel')
const Course = require('../models/CourseModel')

const addClassToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const classData = req.body;

        const newClass = await CourseService.addClassToCourse(courseId, classData);

        return res.status(201).json({
            status: 'OK',
            message: 'Class added successfully',
            data: newClass,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const createCourse = async (req, res) => {
    try {
        const { name, image, type, studentCount, price, rating, description, discount, teacher, classes } = req.body;

        // Kiểm tra input
        if (!name || !type || !studentCount ||!rating|| !price  || !discount || !teacher || !classes) {
            return res.status(400).json({
                status: 'ERR',
                message: 'All fields are required',
            });
        }

        // Kiểm tra xem giảng viên có tồn tại không
        const checkTeacher = await User.findById(teacher);
        if (!checkTeacher || !checkTeacher.isTeacher) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid teacher ID',
            });
        }

        // Tạo khóa học mới
        const newCourse = await Course.create({
            name,
            image,
            type,
            studentCount: Number(studentCount),
            price,
            rating,
            description,
            discount: Number(discount),
            teacher, // Gán giảng viên
            classes, // Danh sách lớp học
        });

        return res.status(201).json({
            status: 'OK',
            message: 'Course created successfully',
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        const data = req.body
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await CourseService.updateCourse(courseId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(courseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id
        if (!courseId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The courseId is required'
            })
        }
        const response = await CourseService.deleteCourse(courseId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await CourseService.deleteManyCourse(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCourse = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await CourseService.getAllCourse(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await CourseService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCourse,
    updateCourse,
    getDetailsCourse,
    deleteCourse,
    getAllCourse,
    deleteMany,
    getAllType,
    addClassToCourse
}
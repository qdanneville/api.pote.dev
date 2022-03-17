import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import { Course, CourseProps } from '../../domain/course';
import { Difficulty, DifficultyProps } from '../../domain/difficulty';
import { Formation, FormationProps } from '../../domain/formation';
import { Prerequisite, PrerequisiteProps } from '../../domain/prerequisite';
import { Slug } from '../../domain/slug';
import { Tag, TagProps } from '../../domain/tag';
import { Technology, TechnologyProps } from '../../domain/technology';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { FormationRepository } from '../../repos/formationRepository';
import { TagRepository } from '../../repos/tagRepository';
import { PrerequisiteRepository } from '../../repos/prerequisiteRepository';
import { TechnologyRepository } from '../../repos/technologyRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service';
import { CourseRepository } from '../../repos/courseRepository';
import { Chapter, ChapterProps } from '../../domain/chapter';
import { ChapterRepository } from '../../repos/chapterRepository';
import { Lesson, LessonProps } from '../../domain/lesson';
import { LessonRepository } from '../../repos/lessonRepository';

interface NotionContent {
    formations: Formation[]
    courses: Course[]
    tags: Tag[]
    technologies: Technology[]
    difficulties: Difficulty[]
    prerequisites: Prerequisite[]
}

@Injectable()
export class NotionContentService implements NotionContent {
    formations: Formation[]
    courses: Course[]
    chapters: Chapter[]
    lessons: Lesson[]
    tags: Tag[]
    technologies: Technology[]
    difficulties: Difficulty[]
    prerequisites: Prerequisite[]

    constructor(
        private notionProviderService: NotionProviderService,
        private formationRepository: FormationRepository,
        private courseRepository: CourseRepository,
        private chapterRepository: ChapterRepository,
        private lessonRepository: LessonRepository,
        private tagRepository: TagRepository,
        private technologyRepository: TechnologyRepository,
        private difficultyRepository: DifficultyRepository,
        private prerequisiteRepository: PrerequisiteRepository,
    ) {
        this.formations = []
        this.courses = []
        this.chapters = []
        this.lessons = []
        this.tags = []
        this.technologies = []
        this.difficulties = []
        this.prerequisites = []
    }

    public async syncContentFromNotion() {
        await this.syncPrerequisites()
        await this.syncDifficulties()
        await this.syncTechnologies()
        await this.syncTags()
        await this.syncCourses()
        await this.syncChapters()
        await this.syncFormations()
    }

    public async syncFormations() {
        const formations = await this.notionProviderService.getFormations();

        try {
            await Promise.all(formations.map(async (formation) => {
                if (formation.isPublished) {
                    let formationDomain: Formation
                    let courses: Course[]
                    let difficulty: Difficulty;
                    let technologies: Technology[];

                    const notionFormation = await this.notionProviderService.getSplitBeePage(formation.id)
                    const formationDetail = notionFormation[Object.keys(notionFormation)[0]].value
                    const formationSlug = Slug.create({ value: formation.slug })

                    console.log('formation : ', formation)
                    console.log('notion formation  : ', notionFormation)

                    const formationProps: FormationProps = {
                        slug: formationSlug,
                        description: formation.description,
                        notionPageId: formation.id,
                        title: formation.title,
                        imageUrl: formationDetail.format?.page_cover ? formationDetail.format?.page_cover : null,
                        isPublished: formation.isPublished,
                    }

                    if (formation.courses) {
                        courses = await Promise.all(formation.courses?.map(async (course) => (await this.courseRepository.getCourseByNotionPageId(course)).id.toString()))
                        formationProps['courses'] = courses
                    }

                    if (formation.difficulty) {
                        difficulty = await this.difficultyRepository.getDifficultyByNotionPageId(formation.difficulty[0])
                        formationProps['difficulty'] = difficulty
                    }

                    if (formation.technologies) {
                        technologies = await Promise.all(formation.technologies?.map(async (technology) => (await this.technologyRepository.getTechnologyByNotionPageId(technology)).technologyId))
                        formationProps['technologies'] = technologies
                    }

                    const alreadyCreatedFormation = await this.formationRepository.getFormationByNotionPageId(formation.id)

                    if (alreadyCreatedFormation) {
                        //update existing formation
                        formationDomain = Formation.create(formationProps, alreadyCreatedFormation.id)
                        this.formationRepository.updateFormation(formationDomain)
                    } else {
                        //create formation
                        formationDomain = Formation.create(formationProps)
                        this.formationRepository.createFormation(formationDomain)
                    }

                    this.formations.push(formationDomain)
                }
            }));
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }

    public async syncCourses() {

        const courses = await this.notionProviderService.getCourses();

        try {
            await Promise.all(courses.map(async course => {
                let courseDomain: Course;

                const notionCourse = await this.notionProviderService.getNotionPage(course.id)

                const title = notionCourse.properties.title.title[0].plain_text
                const slug = notionCourse.properties.slug.rich_text[0].plain_text
                const description = notionCourse.properties.description.rich_text[0].plain_text
                const icon = notionCourse.icon.emoji
                const order = notionCourse.properties.order?.number
                const difficulty: Difficulty = await this.difficultyRepository.getDifficultyByNotionPageId(course.difficulty[0])
                const technologies: Technology[] = await Promise.all(course.technologies?.map(async (technology) => (await this.technologyRepository.getTechnologyByNotionPageId(technology)).technologyId))
                const tags: Tag[] = await Promise.all(course.tags?.map(async (tag) => (await this.tagRepository.getTagByNotionPageId(tag)).tagId))
                const prerequisites: Prerequisite[] = await Promise.all(course.prerequisites?.map(async (prerequisite) => (await this.prerequisiteRepository.getPrerequisiteByNotionPageId(prerequisite)).prerequisiteId))

                const courseProps: CourseProps = {
                    slug: Slug.create({ value: slug }),
                    description,
                    title,
                    notionPageId: course.id,
                    imageUrl: icon,
                    isPublished: course.isPublished,
                    order,
                    difficulty,
                    technologies,
                    tags,
                    prerequisites
                }

                const alreadyCreatedCourse = await this.courseRepository.getCourseByNotionPageId(course.id)

                if (alreadyCreatedCourse) {
                    //update Course
                    courseDomain = Course.create(courseProps, alreadyCreatedCourse.id)
                    this.courseRepository.updateCourse(courseDomain)
                } else {
                    //create Course
                    courseDomain = Course.create(courseProps)
                    this.courseRepository.createCourse(courseDomain)
                }

                this.courses.push(courseDomain)
            }))
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }

    public async syncChapters() {

        const chapters = await this.notionProviderService.getChapters();

        try {
            await Promise.all(chapters.map(async chapter => {
                let chapterDomain: Chapter;

                const notionChapter = await this.notionProviderService.getNotionPage(chapter.id)

                const title = notionChapter.properties.title.title[0].plain_text
                const slug = notionChapter.properties.slug.rich_text[0].plain_text
                const icon = notionChapter.icon.emoji
                const order = notionChapter.properties.order?.number
                const course: Course = await this.courseRepository.getCourseByNotionPageId(chapter.course[0])
                // const lessons: [] = await Promise.all(course.technologies?.map(async (technology) => (await this.technologyRepository.getTechnologyByNotionPageId(technology)).technologyId))

                const lessons = await this.notionProviderService.getChapterLessons(chapter.id);

                //Create or update lessons
                const chapterProps: ChapterProps = {
                    slug: Slug.create({ value: slug }),
                    title,
                    notionPageId: chapter.id,
                    imageUrl: icon,
                    order,
                    course
                }

                const alreadyCreatedChapter = await this.chapterRepository.getChapterByNotionPageId(chapter.id)

                if (alreadyCreatedChapter) {
                    //update Chapter
                    chapterDomain = Chapter.create(chapterProps, alreadyCreatedChapter.id)
                    this.chapterRepository.updateChapter(chapterDomain)
                } else {
                    //create Chapter
                    chapterDomain = Chapter.create(chapterProps)
                    this.chapterRepository.createChapter(chapterDomain)
                }

                const chapterLessons = await this.syncLessons(lessons, chapterDomain)
                this.chapters.push(chapterDomain)
            }))
        }
        catch (err) {
            console.log(err.message);
            throw new BadRequestException(err.message)
        }
    }

    public async syncLessons(lessons, chapter: Chapter) {
        try {
            return await Promise.all(lessons.map(async lesson => {
                let lessonDomain: Lesson

                const notionLesson = await this.notionProviderService.getNotionPage(lesson.id)

                const title = lesson.title
                const slug = lesson.slug
                const icon = notionLesson?.icon?.emoji
                const order = lesson.order
                const duration = lesson.duration

                const lessonProps: LessonProps = {
                    slug: Slug.create({ value: slug }),
                    title,
                    notionPageId: lesson.id,
                    imageUrl: icon,
                    order,
                    duration,
                    chapter: chapter
                }

                const alreadyCreatedLesson = await this.lessonRepository.getLessonByNotionPageId(lesson.id)

                if (alreadyCreatedLesson) {
                    //update Lesson
                    lessonDomain = Lesson.create(lessonProps, alreadyCreatedLesson.id)
                    this.lessonRepository.updateLesson(lessonDomain)
                } else {
                    //create Lesson
                    lessonDomain = Lesson.create(lessonProps)
                    this.lessonRepository.createLesson(lessonDomain)
                }

                this.lessons.push(lessonDomain)

                return lessonDomain
            }))
        }
        catch (err) {
            console.log(err.message)
            throw new BadRequestException(err.message)
        }
    }


    public async syncTags() {

        const tags = await this.notionProviderService.getTags();

        try {
            await Promise.all(tags.map(async tag => {
                let tagDomain: Tag;

                const notionTag = await this.notionProviderService.getNotionPage(tag.id)

                const name = notionTag.properties.name.title[0].plain_text
                const slug = notionTag.properties.slug.rich_text[0].plain_text
                const icon = notionTag.icon.emoji

                const tagProps: TagProps = {
                    slug: Slug.create({ value: slug }),
                    name,
                    notionPageId: tag.id,
                    imageUrl: icon
                }

                const alreadyCreatedTag = await this.tagRepository.getTagByNotionPageId(tag.id)

                if (alreadyCreatedTag) {

                    tagProps.tagId = alreadyCreatedTag.tagId

                    tagDomain = Tag.create(tagProps)
                    this.tagRepository.updateTag(tagDomain)
                } else {
                    //create formation
                    tagDomain = Tag.create(tagProps)
                    this.tagRepository.createTag(tagDomain)
                }

                this.tags.push(tagDomain)
            }))
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }

    public async syncTechnologies() {

        const technologies = await this.notionProviderService.getTechnologies();

        try {
            await Promise.all(technologies.map(async technology => {
                let technologyDomain: Technology;

                const notiontechnology = await this.notionProviderService.getNotionPage(technology.id)

                const name = notiontechnology.properties.name.title[0].plain_text
                const slug = notiontechnology.properties.slug.rich_text[0].plain_text
                const icon = notiontechnology.icon.emoji

                const technologyProps: TechnologyProps = {
                    slug: Slug.create({ value: slug }),
                    name,
                    notionPageId: technology.id,
                    imageUrl: icon
                }

                const alreadyCreatedtechnology = await this.technologyRepository.getTechnologyByNotionPageId(technology.id)

                if (alreadyCreatedtechnology) {

                    technologyProps.technologyId = alreadyCreatedtechnology.technologyId

                    technologyDomain = Technology.create(technologyProps)
                    this.technologyRepository.updateTechnology(technologyDomain)
                } else {
                    //create formation
                    technologyDomain = Technology.create(technologyProps)
                    this.technologyRepository.createTechnology(technologyDomain)
                }

                this.technologies.push(technologyDomain)
            }))
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }

    public async syncDifficulties() {

        const difficulties = await this.notionProviderService.getDifficulties();

        try {
            await Promise.all(difficulties.map(async difficulty => {
                let difficultyDomain: Difficulty;

                const notiondifficulty = await this.notionProviderService.getNotionPage(difficulty.id)

                const name = notiondifficulty.properties.name.title[0].plain_text
                const slug = notiondifficulty.properties.slug.rich_text[0].plain_text
                const icon = notiondifficulty.icon.emoji

                const difficultyProps: DifficultyProps = {
                    slug: Slug.create({ value: slug }),
                    name,
                    notionPageId: difficulty.id,
                    imageUrl: icon
                }

                const alreadyCreatedDifficulty = await this.difficultyRepository.getDifficultyByNotionPageId(difficulty.id)

                if (alreadyCreatedDifficulty) {

                    difficultyProps.difficultyId = alreadyCreatedDifficulty.difficultyId

                    difficultyDomain = Difficulty.create(difficultyProps)
                    this.difficultyRepository.updateDifficulty(difficultyDomain)
                } else {
                    //create formation
                    difficultyDomain = Difficulty.create(difficultyProps)
                    this.difficultyRepository.createDifficulty(difficultyDomain)
                }

                this.difficulties.push(difficultyDomain)
            }))
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }

    public async syncPrerequisites() {

        const prerequisites = await this.notionProviderService.getPrerequisites();

        try {
            await Promise.all(prerequisites.map(async prerequisite => {
                let prerequisiteDomain: Prerequisite;

                const notionPrerequisite = await this.notionProviderService.getNotionPage(prerequisite.id)

                const name = notionPrerequisite.properties.name.title[0].plain_text
                const description = notionPrerequisite.properties.description.rich_text[0].plain_text

                const prerequisiteProps: PrerequisiteProps = {
                    name,
                    description,
                    notionPageId: prerequisite.id,
                }

                const alreadyCreatedPrerequisite = await this.prerequisiteRepository.getPrerequisiteByNotionPageId(prerequisite.id)

                if (alreadyCreatedPrerequisite) {

                    prerequisiteProps.prerequisiteId = alreadyCreatedPrerequisite.prerequisiteId

                    prerequisiteDomain = Prerequisite.create(prerequisiteProps)
                    this.prerequisiteRepository.updatePrerequisite(prerequisiteDomain)
                } else {
                    //create formation
                    prerequisiteDomain = Prerequisite.create(prerequisiteProps)
                    this.prerequisiteRepository.createPrerequisite(prerequisiteDomain)
                }

                this.prerequisites.push(prerequisiteDomain)
            }))
        }
        catch (err) {
            throw new BadRequestException(err.message)
        }
    }
}
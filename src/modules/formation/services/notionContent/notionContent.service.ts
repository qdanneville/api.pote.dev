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
import { technologyRepository } from '../../repos/technologyRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service';
import { CourseRepository } from '../../repos/courseRepository';

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
    tags: Tag[]
    technologies: Technology[]
    difficulties: Difficulty[]
    prerequisites: Prerequisite[]

    constructor(
        private notionProviderService: NotionProviderService,
        private formationRepository: FormationRepository,
        private courseRepository: CourseRepository,
        private tagRepository: TagRepository,
        private technologyRepository: technologyRepository,
        private difficultyRepository: DifficultyRepository,
        private prerequisiteRepository: PrerequisiteRepository,
    ) {
        this.formations = []
        this.courses = []
        this.tags = []
        this.technologies = []
        this.difficulties = []
        this.prerequisites = []
    }

    public async syncFormationsFromNotion() {
        const formations = await this.notionProviderService.getFormations();

        try {
            await Promise.all(formations.map(async (formation) => {
                if (formation.isPublished) {
                    let formationDomain: Formation
                    let difficulty: Difficulty;
                    let technologies: Technology[];

                    const notionFormation = await this.notionProviderService.getSplitBeePage(formation.id)
                    const formationDetail = notionFormation[Object.keys(notionFormation)[0]].value
                    const formationSlug = Slug.create({ value: formation.slug })

                    const formationProps: FormationProps = {
                        slug: formationSlug,
                        notionPageId: formation.id,
                        title: formation.title,
                        imageUrl: formationDetail.format?.page_cover ? formationDetail.format?.page_cover : null,
                        isPublished: formation.isPublished,
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

                console.log('course from notion ', notionCourse)

                const title = notionCourse.properties.title.title[0].plain_text
                const slug = notionCourse.properties.slug.rich_text[0].plain_text
                const icon = notionCourse.icon.emoji
                const order = notionCourse.properties.order
                const difficulty: Difficulty = await this.difficultyRepository.getDifficultyByNotionPageId(course.difficulty[0])
                const technologies: Technology[] = await Promise.all(course.technologies?.map(async (technology) => (await this.technologyRepository.getTechnologyByNotionPageId(technology)).technologyId))
                const tags: Tag[] = await Promise.all(course.tags?.map(async (tag) => (await this.tagRepository.getTagByNotionPageId(tag)).tagId))
                const prerequisites: Prerequisite[] = await Promise.all(course.prerequisites?.map(async (prerequisite) => (await this.prerequisiteRepository.getPrerequisiteByNotionPageId(prerequisite)).prerequisiteId))

                const courseProps: CourseProps = {
                    slug: Slug.create({ value: slug }),
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
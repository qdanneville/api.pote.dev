import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import { Course } from '../../domain/course';
import { Difficulty, DifficultyProps } from '../../domain/difficulty';
import { Formation, FormationProps } from '../../domain/formation';
import { Prerequisite } from '../../domain/prerequisite';
import { Slug } from '../../domain/slug';
import { Tag, TagProps } from '../../domain/tag';
import { Technology, TechnologyProps } from '../../domain/technology';
import { DifficultyRepository } from '../../repos/difficultyRepository';
import { FormationRepository } from '../../repos/formationRepository';
import { TagRepository } from '../../repos/tagRepository';
import { technologyRepository } from '../../repos/technologyRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service';

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
        private tagRepository: TagRepository,
        private technologyRepository: technologyRepository,
        private difficultyRepository: DifficultyRepository,
    ) {
        this.formations = []
        this.tags = []
        this.technologies = []
        this.difficulties = []
    }

    public async syncFormationsFromNotion() {
        const formations = await this.notionProviderService.getFormations();

        try {
            await Promise.all(formations.map(async (formation) => {
                if (formation.isPublished) {
                    let formationDomain: Formation

                    const notionFormation = await this.notionProviderService.getSplitBeePage(formation.id)
                    const formationDetail = notionFormation[Object.keys(notionFormation)[0]].value
                    const formationSlug = Slug.create({ value: formation.slug })

                    const courses = await this.syncFormationCourses(formation.courses)

                    const formationProps: FormationProps = {
                        slug: formationSlug,
                        notionPageId: formation.id,
                        title: formation.title,
                        imageUrl: formationDetail.format?.page_cover ? formationDetail.format?.page_cover : null,
                        isPublished: formation.isPublished
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

    public async syncFormationCourses(courses) {
        // if (courses && courses.length > 0) {
        //     return await Promise.all(courses.map(async (courseId) => {
        //         console.log('course page id : ', courseId)
        //         const notionCourse = await this.notionProviderService.getNotionPage(courseId)
        //         console.log('course page from notion API : ', notionCourse)

        //         const notionTags = notionCourse.properties.tags.relation
        //         console.log(notionTags)
        //         await this.syncTags(notionTags);

        //         // const courseDetail = notionCourse[Object.keys(notionCourse)[0]].value

        //         // console.log('course detail :', courseDetail);

        //         // const formationProps = {
        //         //     slug: formation.slug,
        //         //     notionPageId: formation.id,
        //         //     title: formation.title,
        //         //     imageUrl: formationDetail.format?.page_cover ? formationDetail.format?.page_cover : null,
        //         // }

        //         // const formationDomain = Formation.create(formationProps)
        //         // await this.formationRepository.createOrUpdateFormation(formationDomain)

        //         // this.formations.push(formationDomain)
        //     }));
        // }
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

                const alreadyCreateddifficulty = await this.difficultyRepository.getDifficultyByNotionPageId(difficulty.id)

                if (alreadyCreateddifficulty) {

                    difficultyProps.difficultyId = alreadyCreateddifficulty.difficultyId

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
}
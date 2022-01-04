import { Injectable, BadRequestException, BadGatewayException } from '@nestjs/common';
import { Course } from '../../domain/course';
import { Difficutly } from '../../domain/difficulty';
import { Formation } from '../../domain/formation';
import { Prerequisite } from '../../domain/prerequisite';
import { Slug } from '../../domain/slug';
import { Tag, TagProps } from '../../domain/tag';
import { Technology } from '../../domain/technology';
import { FormationRepository } from '../../repos/formationRepository';
import { TagRepository } from '../../repos/tagRepository';
import { NotionProviderService } from '../notionProvider/notionProvider.service';

interface NotionContent {
    formations: Formation[]
    courses: Course[]
    tags: Tag[]
    technologies: Technology[]
    difficulties: Difficutly[]
    prerequisites: Prerequisite[]
}

@Injectable()
export class NotionContentService implements NotionContent {
    formations: Formation[]
    courses: Course[]
    tags: Tag[]
    technologies: Technology[]
    difficulties: Difficutly[]
    prerequisites: Prerequisite[]

    constructor(
        private notionProviderService: NotionProviderService,
        private formationRepository: FormationRepository,
        private tagRepository: TagRepository
    ) {
        this.formations = []
        this.tags = []
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

                    const formationProps = {
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
}
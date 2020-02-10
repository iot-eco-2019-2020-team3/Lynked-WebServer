import { ILecture } from '@entities';
import { pool } from '@dbConnection';


export interface ILectureDao {
    getAll: () => Promise<ILecture[] | void>;
    getById(id: number): Promise<ILecture | null | undefined>
    getByTopic(topic: string): Promise<ILecture | null | undefined>
    add: (lecture: ILecture) => Promise<void>;
    update: (lecture: ILecture) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export class LectureDao implements ILectureDao {
    public async getById(id: number): Promise<ILecture | null | undefined> {
        const res = await pool<ILecture>('lectures').first()
            .select()
            .where({
                id: id
            })
            .then(resp => {
                return resp;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
        return res;
    }

    public async getByTopic(topic: string): Promise<ILecture | null | undefined> {
        const res = await pool<ILecture>('lectures').first()
            .select()
            .where({
                topic: topic
            })
            .then(resp => {
                return resp;
            })
            .catch(err => {
                console.log(err);
                return null;
            });
        return res;
    }

    /**
     *
     */
    public async getAll(): Promise<ILecture[] |void> {
        try {
            const res = await pool<ILecture>('lectures')
                .select()
                .then(resp => {
                    return resp;
                })
                .catch(err => {
                    console.log(err);
                });
            return res;
        } catch (error) {
            throw error;
        }
    }


    /**
     *
     * @param lecture
     */
    public async add(lecture: ILecture): Promise<void> {
        try {
            pool<ILecture>('lectures')
                .insert({
                    id: lecture.id,
                    topic: lecture.topic,
                    profID: lecture.profID,
                    slackID: lecture.slackID,
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    }


    /**
     *
     * @param lecture
     */
    public async update(lecture: ILecture): Promise<void> {
        try {
            pool<ILecture>('lectures')
                .where({
                    id: lecture.id
                })
                .update({
                    topic: lecture.topic,
                    profID: lecture.profID,
                    slackID: lecture.slackID,
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        try {
            pool<ILecture>('lectures')
                .where({
                    id: id
                })
                .del()
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    }
}

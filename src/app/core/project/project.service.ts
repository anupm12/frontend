import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import BACKEND_URLS from '@app/shared/backend-urls';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import {
  MUTATION_ADD_PROJECT,
  MUTATION_ADD_ISSUE_COMMENT,
  MUTATION_ADD_ISSUE_COMMENT_REPLY,
  MUTATION_ADD_ISSUE,
  MUTATION_UPDATE_LIKE_COUNTER
} from '@app/shared/mutations';
import { QUERY_PROJECT_DETAILS, QUERY_CHECKPOINT_ISSUES } from '@app/shared/queries';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient, private apollo: Apollo) {}

  /**
   * ADD A PROJECT
   */
  public addProject(projectDetails: Object) {
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ADD_PROJECT,
        variables: {
          objects: [
            {
              project_name: projectDetails['projectName'],
              description: projectDetails['description'],
              current_stage: projectDetails['currentStage'],
              owner: localStorage.getItem('userId')
            }
          ]
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * fetchIssueInCheckpoint
   */
  public fetchIssueInCheckpoint(checkpointName: string, projectId: number) {
    return this.apollo
      .watchQuery<any>({
        query: QUERY_CHECKPOINT_ISSUES,
        variables: {
          checkpointName: checkpointName,
          projectId: projectId
        }
      })
      .valueChanges.pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * GET PROJECT DETAILS
   */
  public getProject(id: string) {
    return this.apollo
      .watchQuery<any>({
        query: QUERY_PROJECT_DETAILS,
        variables: {
          id: id
        }
      })
      .valueChanges.pipe(
        map((res: any) => {
          return res.data.project;
        })
      );
  }

  /**
   * FETCH IDEA
   */
  public fetchIdea(idList: string) {
    return this.http
      .get(BACKEND_URLS.FETCH_ISSUE_OBJECT, {
        params: {
          id: idList
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * Add Comments for an issue in the project.
   */
  public addComment(commentText: string, projectId: string, issueId: string) {
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ADD_ISSUE_COMMENT,
        variables: {
          objects: {
            comment_text: commentText,
            project_id: projectId,
            issue_id: issueId,
            commenter: localStorage.getItem('userId')
          }
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * Add Reply for a comment in the project.
   */
  public addReply(commentId: string, replyText: string) {
    return this.apollo
      .mutate<any>({
        mutation: MUTATION_ADD_ISSUE_COMMENT_REPLY,
        variables: {
          objects: {
            reply_text: replyText,
            comment_id: commentId,
            respondent: localStorage.getItem('userId')
          }
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * Add Issue for a checkpoint in the project.
   */
  public addIssue(checkpointName: string, issuesDescription: string, projectId: string) {
    return this.apollo
      .mutate({
        mutation: MUTATION_ADD_ISSUE,
        variables: {
          objects: {
            checkpoint_name: checkpointName,
            description: issuesDescription,
            project_id: projectId,
            created_by: localStorage.getItem('userId')
          }
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * incrementOrDecrementLikeCounter
   */
  public incrementOrDecrementLikeCounter(commentId: number) {
    console.log(commentId);

    return this.apollo
      .mutate({
        mutation: MUTATION_UPDATE_LIKE_COUNTER,
        variables: {
          likesOffCounter: 1,
          commentId: commentId
        }
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}

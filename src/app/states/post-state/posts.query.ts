import { QueryEntity } from '@datorama/akita';
import { PostsStore, PostsState } from './posts.store';
import { Post } from './posts.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GraphQLService } from 'src/app/services/graph-ql.service';
import { listPosts } from 'src/graphql/queries';

@Injectable({
  providedIn: 'root'
})
export class PostsQuery extends QueryEntity<PostsState> {

  constructor(
    protected store: PostsStore,
    private graphQLService: GraphQLService
  ) {
    super(store);
  }

  /**
   * check if store has data
   * if it does, simply return this.selectEntity(id)
   * if it doesn't, attempt to retrieve data from the backend
   *
   * ADVANCED: at the end of this step, also **subscribe** to any updates
   *           of that post for some awesome real-time stuff.
   */
  selectPost(id: string): Observable<Post> {
    // If store does not have selected post, fetch data from server
    if (!this.hasEntity(id)) {
      this.getPostsFromServer();
    }

    return this.selectEntity(id);
  }

  getPosts(): Observable<Post[]> {
    // If store is empty, fetch data from server
    if (this.getCount() === 0) {
      this.getPostsFromServer();
    }

    return this.selectAll();
  }

  async getPostsFromServer(): Promise<any> {
    return await this.graphQLService.query(listPosts, null)
      .then(
        (response) => this.store.set(response.data.listPosts.items)
      );
  }
}

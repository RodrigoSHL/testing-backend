import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const date = new Date();
      createPostDto.createdAt = date;
      const post = this.postRepository.create(createPostDto);
      await this.postRepository.save(post);
      return post;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  findAll() {
    return this.postRepository.find();
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

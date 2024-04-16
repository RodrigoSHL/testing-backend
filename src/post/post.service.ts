import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger('PostService');

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
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return this.postRepository.find();
  }

  async findOne(term: string) {
    const post = await this.postRepository.findOneBy({ id: term });
    console.log('post', post);

    if (!post) throw new NotFoundException(`Product with ${term} not found`);

    return post;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.postRepository.remove(product);
    return product;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !ValidationPipe.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors: ValidationError[] = await validate(object);
    if (errors.length) {
      throw new HttpException(
        `Validation Error - ${errors
          .map((err) => ({
            message: Object.keys(err.constraints || {}).length
              ? Object.values(err.constraints || {})[0]
              : '',
            property: err.property,
            value: err.value,
          }))
          .join(' - ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return object;
  }

  private static toValidate(metaType: any): boolean {
    return ![String, Boolean, Number, Array, Object].includes(metaType);
  }
}

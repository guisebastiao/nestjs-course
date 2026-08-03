import { ProductImageRepository } from "@/modules/product-image/product-image.repository";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "@/modules/products/product.repository";
import { LoggerService } from "@/common/logger/logger.service";
import { STORAGE } from "@/common/storage/storage.constants";

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
    private readonly productRepository: ProductRepository,
    private readonly logger: LoggerService,
  ) {}

  async saveAll(images: Express.Multer.File[], productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      this.logger.warn({
        message: "Product not found when trying to save product images.",
        class: ProductImageService.name,
        method: this.saveAll.name,
        data: {
          productId,
          imageCount: images.length,
        },
      });

      throw new NotFoundException("Product not found.");
    }

    const totalImages = product.images.length + images.length;

    if (totalImages > STORAGE.PRODUCT_IMAGES.MAX_FILES) {
      this.logger.warn({
        message: "Maximum number of images exceeded for the product.",
        class: ProductImageService.name,
        method: this.saveAll.name,
        data: {
          productId,
          imageCount: images.length,
          totalImages,
          maxFiles: STORAGE.PRODUCT_IMAGES.MAX_FILES,
        },
      });

      throw new BadRequestException("Maximum number of images exceeded for the product.");
    }
  }
}

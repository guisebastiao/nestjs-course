import { UpdateCartItemDTO } from "@/modules/cart-items/dto/update-cart-item.dto";
import { CartItemRepository } from "@/modules/cart-items/cart-item.repository";
import { AddCartItemDTO } from "@/modules/cart-items/dto/add-cart-item.dto";
import { ProductRepository } from "@/modules/products/product.repository";
import { CartItemEntity } from "@/modules/cart-items/cart-item.entity";
import { CartItemDTO } from "@/modules/cart-items/dto/cart-item.dto";
import { CartItemMapper } from "@/common/mappers/cart-item.mapper";
import { CartRepository } from "@/modules/carts/cart.repository";
import { PaginationQuery } from "@/common/dto/pagination-query";
import { Injectable, NotFoundException } from "@nestjs/common";
import { LoggerService } from "@/common/logger/logger.service";
import { UserEntity } from "@/modules/users/user.entity";
import { CartEntity } from "@/modules/carts/cart.entity";
import { Pagination } from "@/common/dto/pagination";
import { Request } from "express";

@Injectable()
export class CartItemService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
    private readonly cartItemMapper: CartItemMapper,
    private readonly logger: LoggerService,
  ) {}

  async addCartItem(req: Request, user: UserEntity, dto: AddCartItemDTO): Promise<CartItemDTO> {
    const cart = await this.findCartOrCreateByUser(user);

    const product = await this.productRepository.findById(dto.productId);

    if (!product) {
      this.logger.warn({
        message: "Product not found when creating cart item.",
        path: req.path,
        class: CartItemService.name,
        method: this.addCartItem.name,
        data: { productId: dto.productId },
      });

      throw new NotFoundException("Product not found.");
    }

    const entity = new CartItemEntity();
    entity.cart = cart;
    entity.product = product;
    entity.quantity = dto.quantity;

    const saved = await this.cartItemRepository.save(entity);

    return this.cartItemMapper.toResponse(saved);
  }

  async findAllItems(user: UserEntity, params: PaginationQuery) {
    const [cartItems, total] = await this.cartItemRepository.findItemsByUserId(user.id, params);

    return {
      cartItems: cartItems.map((cartItem) => this.cartItemMapper.toResponse(cartItem)),
      pagination: new Pagination(params.page, params.limit, total, Math.ceil(total / params.limit)),
    };
  }

  async update(req: Request, user: UserEntity, itemId: string, dto: UpdateCartItemDTO) {
    const entity = await this.cartItemRepository.findByIdAndUser(itemId, user.id);

    if (!entity) {
      this.logger.warn({
        message: "Cart item not found in update item.",
        path: req.path,
        class: CartItemService.name,
        method: this.update.name,
        data: { itemId },
      });

      throw new NotFoundException("Cart item not found.");
    }

    const updated = this.cartItemMapper.update(entity, dto);

    const saved = await this.cartItemRepository.save(updated);

    return this.cartItemMapper.toResponse(saved);
  }

  async removeCartItem(req: Request, user: UserEntity, itemId: string) {
    const entity = await this.cartItemRepository.findByIdAndUser(itemId, user.id);

    if (!entity) {
      this.logger.warn({
        message: "Cart item not found in remove item.",
        path: req.path,
        class: CartItemService.name,
        method: this.removeCartItem.name,
        data: { itemId },
      });

      throw new NotFoundException("Cart item not found.");
    }

    await this.cartItemRepository.delete(entity);
  }

  async removeAllItems(user: UserEntity) {
    await this.cartItemRepository.deleteAllByUserId(user.id);
  }

  private async findCartOrCreateByUser(user: UserEntity): Promise<CartEntity> {
    const cart = await this.cartRepository.findByUserId(user.id);

    if (!cart) {
      const entity = new CartEntity();
      entity.user = user;
      return await this.cartRepository.save(entity);
    }

    return cart;
  }
}

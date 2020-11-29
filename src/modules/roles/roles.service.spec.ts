import { Test } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { NotFoundException } from '@nestjs/common';

const mockRolesRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('RolesService', () => {
  let rolesService;
  let rolesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RolesRepository,
          useFactory: mockRolesRepository,
        },
      ],
    }).compile();

    rolesService = await module.get<RolesService>(RolesService);
    rolesRepository = await module.get<RolesRepository>(RolesRepository);
  });

  describe('getRoles', () => {
    it('gets all roles from the repository', async () => {
      rolesRepository.find.mockResolvedValue('someValue');

      expect(rolesRepository.find).not.toHaveBeenCalled();
      const result = await rolesService.getRoles();
      expect(rolesRepository.find).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getRoleById', () => {
    it('calls rolesRepository.findOne() and successfully retrieve the role', async () => {
      const mockRole = {
        id: '1',
        name: 'Test Role',
        description: 'Desc Test Role',
      };
      rolesRepository.findOne.mockResolvedValue(mockRole);

      const result = await rolesService.getRoleById('1');
      expect(result).toEqual(mockRole);

      expect(rolesRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('throws an error as role is not found', () => {
      rolesRepository.findOne.mockResolvedValue(null);
      expect(rolesService.getRoleById('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRoleByName', () => {
    it('calls rolesRepository.findOne() and successfully retrieve the role', async () => {
      const mockRole = {
        name: 'Test Role',
        description: 'Desc Test Role',
      };
      rolesRepository.findOne.mockResolvedValue(mockRole);

      const result = await rolesService.getRoleByName('Test Role');
      expect(result).toEqual(mockRole);

      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'Test Role' },
      });
    });

    it('throws an error as role is not found', () => {
      rolesRepository.findOne.mockResolvedValue(null);
      expect(rolesService.getRoleByName('Test Role')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createRole', () => {
    it('calls rolesRepository.create() and returns the result', async () => {
      rolesRepository.save.mockResolvedValue('someRole');

      expect(rolesRepository.save).not.toHaveBeenCalled();
      const roleDTO = {
        name: 'Test Role',
        description: 'Desc Test Role',
      };
      const result = await rolesService.createRole(roleDTO);
      expect(rolesRepository.save).toHaveBeenCalledWith(roleDTO);
      expect(result).toEqual('someRole');
    });
  });

  describe('deleteRole', () => {
    it('calls rolesRepository.deleteRole() and delete a role', async () => {
      rolesRepository.delete.mockResolvedValue({ affected: 1 });
      expect(rolesRepository.delete).not.toHaveBeenCalledWith();
      await rolesService.deleteRole('Test');
      expect(rolesRepository.delete).toHaveBeenCalledWith('Test');
    });

    it('throws an error as role could not be found', () => {
      rolesRepository.delete.mockResolvedValue({ affected: 0 });
      expect(rolesService.deleteRole('Test')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRole', () => {
    it('update a role description', async () => {
      rolesService.getRoleById = jest.fn().mockResolvedValue({
        id: '1',
        name: 'Test',
        description: 'Test description',
      });

      expect(rolesService.getRoleById).not.toHaveBeenCalled();
      expect(rolesRepository.save).not.toHaveBeenCalled();
      const result = await rolesService.updateRole('1', 'New description');
      expect(rolesService.getRoleById).toHaveBeenCalled();
      expect(rolesRepository.save).toHaveBeenCalled();
      expect(result.description).toEqual('New description');
    });
  });
});

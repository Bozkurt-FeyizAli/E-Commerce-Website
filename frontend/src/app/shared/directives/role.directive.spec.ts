import { RoleDirective } from './role.directive';

describe('RoleDirective', () => {
  it('should create an instance', () => {
    const mockTemplateRef = {} as any;
    const mockViewContainer = {} as any;
    const mockAuthService = {} as any;
    const directive = new RoleDirective(mockTemplateRef, mockViewContainer, mockAuthService);
    expect(directive).toBeTruthy();
  });
});


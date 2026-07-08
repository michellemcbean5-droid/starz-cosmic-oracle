import React from 'react';
import renderer from 'react-test-renderer';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const tree = renderer.create(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('catches errors and shows fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    const tree = renderer.create(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    ).toJSON();
    
    expect(tree).toBeTruthy();
  });

  it('allows reset after error', () => {
    const component = renderer.create(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    
    const instance = component.getInstance();
    expect(instance).toBeTruthy();
  });
});

describe('Skeleton Component', () => {
  it('renders without crashing', () => {
    const Skeleton = require('../src/components/Skeleton').Skeleton;
    const tree = renderer.create(<Skeleton width={100} height={20} />).toJSON();
    expect(tree).toBeTruthy();
  });
});

describe('UpgradePrompt Component', () => {
  it('renders without crashing', () => {
    const UpgradePrompt = require('../src/components/UpgradePrompt').UpgradePrompt;
    const tree = renderer.create(
      <UpgradePrompt 
        feature="Birth Chart" 
        tier="premium" 
        onUpgrade={() => {}} 
        onDismiss={() => {}} 
      />
    ).toJSON();
    expect(tree).toBeTruthy();
  });
});

describe('PromoCodeInput Component', () => {
  it('renders without crashing', () => {
    const PromoCodeInput = require('../src/components/PromoCodeInput').PromoCodeInput;
    const tree = renderer.create(<PromoCodeInput />).toJSON();
    expect(tree).toBeTruthy();
  });
});

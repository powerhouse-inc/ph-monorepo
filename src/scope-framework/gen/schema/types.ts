export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddElementInput = {
  __typename?: 'AddElementInput';
  components: Maybe<ElementComponents>;
  id: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  type: ScopeFrameworkElementType | `${ScopeFrameworkElementType}`;
};

export type ArticleComponent = {
  __typename?: 'ArticleComponent';
  content: Maybe<Scalars['String']['output']>;
};

export type CoreComponent = {
  __typename?: 'CoreComponent';
  content: Maybe<Scalars['String']['output']>;
};

export type ElementComponents = ArticleComponent | CoreComponent | ScopeComponent | SectionComponent | TypeSpecificationComponent;

export type MoveElementInput = {
  __typename?: 'MoveElementInput';
  id: Scalars['ID']['output'];
  newParentId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addElement: Maybe<ScopeFrameworkState>;
  moveElement: Maybe<ScopeFrameworkState>;
  removeElement: Maybe<ScopeFrameworkState>;
  reorderElements: Maybe<ScopeFrameworkState>;
  setRootPath: Maybe<ScopeFrameworkState>;
  updateElementComponents: Maybe<ScopeFrameworkState>;
  updateElementName: Maybe<ScopeFrameworkState>;
  updateElementType: Maybe<ScopeFrameworkState>;
};


export type MutationAddElementArgs = {
  input: AddElementInput;
};


export type MutationMoveElementArgs = {
  input: MoveElementInput;
};


export type MutationRemoveElementArgs = {
  input: RemoveElementInput;
};


export type MutationReorderElementsArgs = {
  input: ReorderElementsInput;
};


export type MutationSetRootPathArgs = {
  input: SetRootPathInput;
};


export type MutationUpdateElementComponentsArgs = {
  input: UpdateElementComponentsInput;
};


export type MutationUpdateElementNameArgs = {
  input: UpdateElementNameInput;
};


export type MutationUpdateElementTypeArgs = {
  input: UpdateElementTypeInput;
};

export type RemoveElementInput = {
  __typename?: 'RemoveElementInput';
  id: Scalars['ID']['output'];
};

export type ReorderElementsInput = {
  __typename?: 'ReorderElementsInput';
  order: Array<Scalars['ID']['output']>;
  parentElementId: Scalars['ID']['output'];
};

export type ScopeComponent = {
  __typename?: 'ScopeComponent';
  content: Maybe<Scalars['String']['output']>;
};

export type ScopeFrameworkElement = {
  __typename?: 'ScopeFrameworkElement';
  components: Maybe<ElementComponents>;
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  type: Maybe<ScopeFrameworkElementType | `${ScopeFrameworkElementType}`>;
  version: Scalars['Int']['output'];
};

export type ScopeFrameworkElementType =
  | 'Article'
  | 'Core'
  | 'Scope'
  | 'Section'
  | 'TypeSpecification';

export type ScopeFrameworkInput = AddElementInput | MoveElementInput | RemoveElementInput | ReorderElementsInput | SetRootPathInput | UpdateElementComponentsInput | UpdateElementNameInput | UpdateElementTypeInput;

export type ScopeFrameworkState = {
  __typename?: 'ScopeFrameworkState';
  elements: Array<ScopeFrameworkElement>;
  rootPath: Scalars['String']['output'];
};

export type SectionComponent = {
  __typename?: 'SectionComponent';
  content: Maybe<Scalars['String']['output']>;
};

export type SetRootPathInput = {
  __typename?: 'SetRootPathInput';
  newRootPath: Scalars['String']['output'];
};

export type TypeSpecificationComponent = {
  __typename?: 'TypeSpecificationComponent';
  additionalLogic: Maybe<Scalars['String']['output']>;
  category: Maybe<TypeSpecificationComponentCategory | `${TypeSpecificationComponentCategory}`>;
  documentIdentifierRules: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  overview: Maybe<Scalars['String']['output']>;
  typeAuthority: Maybe<Scalars['String']['output']>;
};

export type TypeSpecificationComponentCategory =
  | 'Accessory'
  | 'Immutable'
  | 'Primary'
  | 'Supporting';

export type UpdateElementComponentsInput = {
  __typename?: 'UpdateElementComponentsInput';
  components: Maybe<ElementComponents>;
  id: Scalars['ID']['output'];
};

export type UpdateElementNameInput = {
  __typename?: 'UpdateElementNameInput';
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
};

export type UpdateElementTypeInput = {
  __typename?: 'UpdateElementTypeInput';
  id: Scalars['ID']['output'];
  type: ScopeFrameworkElementType | `${ScopeFrameworkElementType}`;
};

import styled from 'styled-components/macro'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 2px;
  background: #f5f5f5;
  border-radius: 64px;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 6px 12px;
  border-radius: 30px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.bg0 : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text3)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 500;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.text2 : theme.text3)};
  }
`
